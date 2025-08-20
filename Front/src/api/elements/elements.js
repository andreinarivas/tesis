import axios from "axios";

/**
 * Agregar/reemplazar nuevos elementos a una arquitectura
 * en la base de datos del usuario
 * @param {FormData} formData objeto form-data con la información de los elementos
 */
const postElements = async (formData) => {
    try {
        const response = await axios.post("/elementos/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

const postUpdatedElements = async (formData) => {
    try {
        const response = await axios.post("/updated-elements/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

/**
 * Llamada al Backend
 * Se encarga de crear la tabla de componentes compuestos
 * @param user referencia al usuario que está utilizando el proyecto
 * @param selectedProject referencia al proyecto seleccionado
 */
const ManageCreateCCBoard = async (user, selectedProject) => {
    try {
        const response = await axios.put("/create_cc_board/", {
            data: {
                user_id: user.uid,
                project_index: selectedProject.projectIndex,
                arch_index: selectedProject.arcIndex,
                ver_index: selectedProject.verIndex,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

/**
 * Llamada al Backend
 * Se encarga de editar el aspecto (descripción) de un componente compuesto
 * @param name referencia al id del componente compuesto
 * @param description input del usuario
 */
const ManageEditCCDescription = async (user, selectedProject, name, description) => {
    try {
        const response = await axios.put("/edit_cc_description/", {
            data: {
                user_id: user.uid,
                project_index: selectedProject.projectIndex,
                arch_index: selectedProject.arcIndex,
                ver_index: selectedProject.verIndex,
                name: name,
                description: description,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

/**
 * Llamada al Backend
 * (NO UTILIZADO) Se encarga de cambiar el ID de un componente compuesto
 * @param name nombre previo a la actualización del componente compuesto
 * @param inputValue input del usuario, nuevo nombre del componente compuesto
 */
const ManageEditCCName = async (user, selectedProject, name, inputValue) => {
    try {
        const response = await axios.put("/edit_cc_name/", {
            data: {
                user_id: user.uid,
                project_index: selectedProject.projectIndex,
                arch_index: selectedProject.arcIndex,
                ver_index: selectedProject.verIndex,
                old_name: name,
                new_name: inputValue,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

/**
 * Llamada al Backend
 * Se encarga de cambiar el componente compuesto de un nodo
 * @param id nombre/id del nodo
 * @param compositeComponent nombre del componente al que se desea cambiar el nodo
 */
const ManageEditNodeCC = async (user, selectedProject, id, compositeComponent) => {
    try {
        const response = await axios.put("/edit_node_cc/", {
            data: {
                user_id: user.uid,
                project_index: selectedProject.projectIndex,
                arch_index: selectedProject.arcIndex,
                ver_index: selectedProject.verIndex,
                node: id,
                new_name: compositeComponent,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

/**
 * Llamada al Backend
 * Se encarga de editar la descripción de un nodo
 * @param node_id nombre/id del nodo
 * @param inputValue descripcion del nodo
 */
const ManageEditNodeDesc = async (user, selectedProject, node_id, inputValue) => {
    try {
        const response = await axios.put("/edit_node_desc/", {
            data: {
                user_id: user.uid,
                project_index: selectedProject.projectIndex,
                arch_index: selectedProject.arcIndex,
                ver_index: selectedProject.verIndex,
                node_id: node_id,
                new_name: inputValue,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

export {
    postElements,
    postUpdatedElements,
    ManageCreateCCBoard,
    ManageEditCCDescription,
    ManageEditCCName,
    ManageEditNodeCC,
    ManageEditNodeDesc,
};
