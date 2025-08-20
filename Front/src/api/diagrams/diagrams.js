import axios from "axios";

/**
 * Llamada al Backend
 * Se encarga de generar el diagrama de clases de la arquitectura seleccionada
 * @param user referencia al usuario que está utilizando el proyecto
 * @param selectedProject referencia a la arquitectura seleccionada
 */
const ManageClassDiagram = (user, selectedProject) => {
    axios
        .put("/create_class_diagram/", {
            data: {
                user_id: user.uid,
                project_index: selectedProject.projectIndex,
                arch_index: selectedProject.arcIndex,
                ver_index: selectedProject.verIndex,
            },
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

    return null;
};

/**
 * Llamada al Backend
 * Se encarga de generar el diagrama de componentes del proyecto
 * @param projectIndex referencia al índice del proyecto seleccionado
 */
const ManageComponentDiagram = (user, projectIndex) => {
    axios
        .put("/create_comp_diagram/", {
            data: {
                user_id: user.uid,
                project_index: projectIndex,
            },
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

    return null;
};

/**
 * Llamada al Backend
 * Se encarga de generar el diagrama de variabilidad del proyecto
 */
const ManageVariability = (user, projectIndex) => {
    axios
        .put("/create_var_diagram/", {
            data: {
                user_id: user.uid,
                project_index: projectIndex,
            },
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

    return null;
};

export { ManageClassDiagram, ManageComponentDiagram, ManageVariability };
