// @ts-nocheck
import React, { useContext, useState } from "react";
import AppContext from "../../auth/context/context";
import { manageEditProject, manageDeleteProject } from "../../helpers/projects/projects";
import { manageEditArchitecture, manageDeleteArchitecture } from "../../helpers/architecture/architecture";
import { ManageClassDiagram, ManageComponentDiagram, ManageVariability } from "../../api/diagrams/diagrams";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Swal from "sweetalert2";

/**
 * Componente que representa al
 * menu popup para manejo de
 * arquitecturas y proyectos
 *
 * setShowUML fue un método realizado por la tercera fase del proyecto, si desea probarlo intercambiar: swalDiagram("class") en línea 136 por setShowUML(true)
 */
const StyledMenu = ({ item, projectIndex, setOpen, setShowUml }) => {
    const { user, selectedProject, setSelectedProject, setReloadSidebar } = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    /**
     * Manejador de click sobre icon
     * para abrir menu
     * @param {Event} event
     */
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Cerrar menu
     * @param {Event} event
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    const swalDiagram = async (type) => {
        const diagram = type;
        return Swal.fire({
            title: "Descargar PDF",
            html: "Se guardará el archivo .pdf en<br>'C:TESISFINAL'",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Descargar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (diagram == "class") {
                    ManageClassDiagram(user, selectedProject);
                    Swal.fire("Descargado!", "El diagrama de clases ha sido descargado", "success");
                }
                if (diagram == "components") {
                    ManageComponentDiagram(user, projectIndex);
                    Swal.fire("Descargado!", "El diagrama de componentes ha sido descargado", "success");
                }
                if (diagram == "variability") {
                    ManageVariability(user, projectIndex);
                    Swal.fire("Descargado!", "El diagrama de variabilidad ha sido descargado", "success");
                }
            }
        });
    };

    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                style={{ transform: "rotate(90deg)" }}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={openMenu}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        padding: 10,
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        setOpen(true);
                        handleClose();
                    }}
                >
                    Agregar Arquitectura
                </MenuItem>
                <MenuItem
                    disabled={item.architectures ? false : true}
                    onClick={() => {
                        manageEditArchitecture(
                            user,
                            projectIndex,
                            item.architectures,
                            setSelectedProject,
                            setReloadSidebar
                        );
                        handleClose();
                    }}
                >
                    Editar Arquitectura
                </MenuItem>
                <MenuItem
                    disabled={item.architectures ? false : true}
                    onClick={() => {
                        manageDeleteArchitecture(
                            user,
                            projectIndex,
                            item.architectures,
                            setSelectedProject,
                            setReloadSidebar
                        );
                        handleClose();
                    }}
                >
                    Eliminar Arquitectura
                </MenuItem>
                <MenuItem
                    disabled={item.architectures ? false : true}
                    onClick={() => {
                        swalDiagram("class");
                        handleClose();
                    }}
                >
                    Diagrama UML de la Arquitectura
                </MenuItem>
                <Divider className="dividerMenu" />
                <MenuItem
                    onClick={() => {
                        swalDiagram("variability");
                        handleClose();
                    }}
                >
                    Mostrar variabilidad
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        swalDiagram("components");
                        handleClose();
                    }}
                >
                    Diagrama de Componentes
                </MenuItem>
                <Divider className="dividerMenu" />
                <MenuItem
                    onClick={() => {
                        manageEditProject(user, item.name, projectIndex, setReloadSidebar);
                        handleClose();
                    }}
                >
                    Editar Proyecto
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        manageDeleteProject(user, item.name, projectIndex, setSelectedProject, setReloadSidebar);
                        handleClose();
                    }}
                >
                    Eliminar Proyecto
                </MenuItem>
            </Menu>
        </>
    );
};

export default StyledMenu;
