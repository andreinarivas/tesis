// @ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import "./Home.css";
import { makeStyles } from "@material-ui/core/styles";

import clsx from "clsx";

import Sidebar from "../../components/SideBar/Sidebar";
import Content from "../../components/Content/Content";
import Table from "../../components/Table/Table";

import Swal from "sweetalert2";

import AppContext from "../../auth/context/context";
import { googleAuth } from "../../firebase/googleAuth";
import { postLogin } from "../../api/login/login";
import UML from "../../components/UML/UML";

/** Componente que representa la página
 *  principal de navegación
 */
function Home() {
    const classes = useStyles();
    const [drawerItems, setDrawerItems] = useState();
    const [open, setOpen] = useState(true);
    const [load, setLoad] = useState(true);
    const [showUml, setShowUml] = useState(false);
    const {
        user,
        setUser,
        reloadSidebar,
        selectedProject,
        setSelectedProject,
    } = useContext(AppContext);

    /**
     * Llamar a google auth para establecer ususario
     */
    const login = async () => {
        let drawer = await googleAuth(setUser);
        setDrawerItems(drawer);
        setLoad(false);
    };

    /**
     * Mensaje de confirmación para cerrar sesión
     */
    const logout = () => {
        Swal.fire({
            text: "¿Seguro que deseas cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--success)",
            cancelButtonColor: "var(--error)",
            confirmButtonText: "Si, seguro",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedProject();
                setLoad(true);
                localStorage.removeItem("user");
                setUser(null);
                setLoad(false);
            }
        });
    };

    /**
     * Cambiar estado de usuario e iniciar sesion
     */
    async function changeState() {
        login();
    }

    /**
     * Actualizar arreglo de proyectos
     */
    const getProject = async () => {
        let elements = await postLogin(user, setUser);
        setDrawerItems(elements);
        setLoad(false);
    };

    /**
     * Llamar a la actualizacion de proyectos
     */
    async function get() {
        getProject();
    }

    useEffect(() => {
        setLoad(false);
        if (user || reloadSidebar) {
            setLoad(true);
            get();
        }
    }, [user, reloadSidebar]);

    return (
        <>
            <Sidebar
                items={drawerItems}
                login={changeState}
                logout={logout}
                loader={load}
                open={open}
                setOpen={setOpen}
                setShowUml={(value) => setShowUml(value)}
            />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                {selectedProject ? (
                    <div>
                        {showUml ? (
                            <UML setShowUml={(value) => setShowUml(value)} />
                        ) : (
                            <Content />
                        )}
                        <Table />
                    </div>
                ) : null}
            </main>
        </>
    );
}

/** Creacion de capa de estilos para el componente */
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        paddingLeft: theme.spacing(2),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginTop: 70,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 270,
    },
}));

export default Home;
