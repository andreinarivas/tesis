import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/EditOutlined";
import Swal from "sweetalert2";

import AppContext from "../../../auth/context/context";
import Loader from "../../Loader/Loader";
import nodeHelper from "../../../helpers/nodes/nodes";
import { postUpdatedElements, ManageEditNodeCC, ManageEditNodeDesc } from "../../../api/elements/elements";
import { manageUpdatedResponse } from "../../../helpers/elements/elements";

/**
 * Componente que representa
 * la tabla de nodos del proyecto selecionado
 */
const NodesTable = (props) => {
    const {
        user,
        selectedProject,
        selectedNodes,
        setSelectedNodes,
        selectionModel,
        setSelectionModel,
        setSelectedProject,
        cy,
    } = useContext(AppContext);
    let [loader, setLoader] = useState(true);

    let rows = selectedProject.elements.nodes.map((node) => {
        return {
            id: node.data.id,
            name: node.data.name,
            isInterface: !node.data.incomompleteProperties ? (node.data.isInterface ? "Si" : "No") : "-",
            isAbstract: node.data.hasOwnProperty("isAbstract") ? (node.data.isAbstract ? "Si" : "No") : "-",
            module: node.data.hasOwnProperty("module") ? node.data.module : "-",
            incomompleteProperties: node.data.incomompleteProperties ? "No" : "Si",
            composite: node.data.hasOwnProperty("composite") ? node.data.composite : "-",
            description: node.data.hasOwnProperty("description") ? node.data.description : "none",
        };
    });

    const columns = [
        { field: "name", headerName: "Nombre", width: 240 },
        { field: "description", headerName: "Funcionalidad", width: 240 },
        {
            field: "change_desc",
            headerName: "Cambiar funcionalidad",
            sortable: false,
            width: 120,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton aria-label="edit" size="large">
                            <EditIcon
                                fontSize="inherit"
                                color="secondary"
                                onClick={(e) => {
                                    props.closeDrawable(false);
                                    onClick(e, params);
                                }}
                            />
                        </IconButton>
                    </>
                );
            },
        },
        { field: "composite", headerName: "Componente Compuesto", width: 240 },
        {
            field: "action",
            headerName: "Cambiar el Nodo de Componente Compuesto",
            sortable: false,
            width: 120,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton aria-label="add" size="large">
                            <EditIcon
                                fontSize="inherit"
                                color="primary"
                                onClick={(e) => {
                                    props.closeDrawable(false);
                                    onClickAdd(e, params);
                                }}
                            />
                        </IconButton>
                    </>
                );
            },
        },
        { field: "isInterface", headerName: "Es Interfaz?", width: 180 },
        { field: "isAbstract", headerName: "Es Abstracto?", width: 180 },
        { field: "module", headerName: "Modulo", width: 180 },
        {
            field: "incomompleteProperties",
            headerName: "Propiedades Completas",
            width: 230,
        },
    ];

    const onClick = async (e, params) => {
        e.stopPropagation(); // don't select this row after clicking

        const api = params.api;
        const thisRow = {};
        let txtTitle;
        let name = "";
        let node_id;

        api.getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => {
                thisRow[c.field] = params.getValue(params.id, c.field);
                if (c.field == "name") {
                    node_id = params.getValue(params.id, c.field);
                } else if (c.field == "description") {
                    txtTitle = "Inserte la funcionalidad de " + node_id;
                }
            });

        return Swal.fire({
            title: txtTitle,
            input: "text",
            inputAttributes: {
                autocapitalize: "off",
            },
            showCancelButton: true,
            confirmButtonText: "Guardar",
            showLoaderOnConfirm: true,
            preConfirm: async (inputValue) => {
                const res = await ManageEditNodeDesc(user, selectedProject, node_id, inputValue);
                return res;
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
            console.log("result");
            console.log(result);
            if (result.isConfirmed) {
                if (result.value.ok) {
                    const formData = new FormData();
                    formData.append("user_id", user.uid);
                    formData.append("ver_index", selectedProject.verIndex);
                    formData.append("arc_index", selectedProject.arcIndex);
                    formData.append("project_index", selectedProject.projectIndex);

                    const response = await postUpdatedElements(formData);
                    console.log("responseeeeeee");
                    console.log(response);
                    manageUpdatedResponse(response, selectedProject, setSelectedProject);

                    Swal.fire("Cambiado con éxito!", "", "success");
                }
            }
        });
    };

    const onClickAdd = async (e, params) => {
        e.stopPropagation(); // don't select this row after clicking

        const api = params.api;
        const thisRow = {};
        let id = "";
        let options = {};
        options["-"] = "-";

        api.getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => {
                thisRow[c.field] = params.getValue(params.id, c.field);
                console.log(c.field);
                if (c.field == "name") {
                    id = params.getValue(params.id, c.field);
                }
            });

        for (let i = 0; i < selectedProject.elements.list_t.length; i++) {
            const list_t = selectedProject.elements.list_t[i];
            if (list_t.description !== "") {
                options[list_t.description] = list_t.description;
            } else {
                options[list_t.name] = list_t.name;
            }
        }

        console.log("options");
        console.log(options);

        return Swal.fire({
            title: "Seleccione el componente al que desea mover el nodo",
            input: "select",
            inputOptions: options,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            showLoaderOnConfirm: true,
            preConfirm: async (compositeComponent) => {
                const res = await ManageEditNodeCC(user, selectedProject, id, compositeComponent);
                console.log(res);
                return res;
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
            //  console.log('result');
            if (result.isConfirmed) {
                if (result.value.ok) {
                    // selectedProject.elements.nodes[];
                    const formData = new FormData();
                    formData.append("user_id", user.uid);
                    formData.append("ver_index", selectedProject.verIndex);
                    formData.append("arc_index", selectedProject.arcIndex);
                    formData.append("project_index", selectedProject.projectIndex);

                    const response = await postUpdatedElements(formData);
                    console.log("responseeeeeee");
                    console.log(response);
                    manageUpdatedResponse(response, selectedProject, setSelectedProject);

                    Swal.fire("Cambiado con éxito!", "", "success");
                }
            }
        });
    };

    useEffect(() => {
        setLoader(false);
    }, [selectedProject.elements]);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            {!loader ? (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={50}
                    checkboxSelection
                    onCellClick={(params) => {
                        nodeHelper.manageCellClick(
                            params.row.name,
                            selectedNodes,
                            setSelectedNodes,
                            cy,
                            setSelectionModel
                        );
                    }}
                    onColumnHeaderClick={(param) => {
                        if (param.field === "__check__") {
                            nodeHelper.manageCheckSelection(selectedNodes, setSelectedNodes, cy, setSelectionModel);
                        }
                    }}
                    selectionModel={selectionModel}
                />
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default NodesTable;
