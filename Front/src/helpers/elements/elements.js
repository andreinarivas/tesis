import { postElements, postUpdatedElements } from '../../api/elements/elements';
import { manageErrors } from "../errors/errors";
import { ModalMessage } from "../../components/ModalMessage/ModalMessage";

/**
 * Manejar los mensajes a mostrar en base a
 * la respuesta obtenida de la API
 * @param {JSON} response respuesta de la llamada a la API
 * @param {JSON} selectedProject objeto con información del proyecto seleccionado
 * @param {Function} setSelectedProject funcion para actualizar proyecto seleccionado
 */
const manageResponse = (response, selectedProject, setSelectedProject, setReloadSidebar) => {
  if (Number.isInteger(response)) {
    setReloadSidebar(false);
    manageErrors(response)
  } else {
    setSelectedProject({
      ...selectedProject,
      elements: response.elements
    });
    setReloadSidebar(false);
    ModalMessage(
      "¡Elementos agregados con exito!",
      " ",
      "success",
      false,
      4000
    );
  }
};

const manageUpdatedResponse = (
  response,
  selectedProject,
  setSelectedProject,
) => {
  if (Number.isInteger(response)) {
    manageErrors(response);
  } else {
    setSelectedProject({
      ...selectedProject,
      elements: response.elements,
    });
  }
};

const manageElementsUpdate = async(
  user,
  selectedProject,
  setSelectedProject,
) => {
  const response = await updatedElements(user, selectedProject)
  manageUpdatedResponse(
    response,
    selectedProject,
    setSelectedProject,
  );
};

const updatedElements = async (user, selectedProject) => {
  const formData = getFormUpdatedData(user, selectedProject);
  const response = await postUpdatedElements(formData);
  return response;
};
const getFormUpdatedData = (user, selectedProject) => {
  const formData = new FormData();
  formData.append('user_id', user.uid);
  formData.append('ver_index', selectedProject.verIndex);
  formData.append('arc_index', selectedProject.arcIndex);
  formData.append('project_index', selectedProject.projectIndex);
  return formData;
};


export { postElements };
/**
 * Llamada a la API para agregar nuevos elementos a una
 * versión de una arquitectura
 * @param {Array} allFiles arreglo que contiene todos los archivos XML
 * @param {JSON} selectedProject objeto con información del proyecto seleccionado
 * @param {Function} setSelectedProject funcion para actualizar proyecto seleccionado
 */
const manageElementsSubmit = async (
  user,
  allFiles,
  selectedProject,
  setSelectedProject,
  setReloadSidebar
) => {
  setReloadSidebar(true);
  const response = await submitElements(allFiles, user, selectedProject);
  manageResponse(response, selectedProject, setSelectedProject, setReloadSidebar);
};

/**
 * Subir los nuevos elementos a la base de datos
 * @param {Array} files arreglo que contiene todos los archivos XML
 * @param {JSON} user objeto con información del usuario
 * @param {JSON} selectedProject objeto con información del proyecto seleccionado
 */
const submitElements = async (files, user, selectedProject) => {
  const formData = getFormData(files, user, selectedProject);
  const response = await postElements(formData);
  return response;
};

/**
 * Construir el form-data
 * @param {Array} files arreglo que contiene todos los archivos XML
 * @param {JSON} user objeto con información del usuario
 * @param {JSON} selectedProject objeto con información del proyecto seleccionado
 * @returns FormData con la información para la API
 */
const getFormData = (files, user, selectedProject) => {
  const formData = new FormData();
  formData.append("user_id", user.uid);
  formData.append("ver_index", selectedProject.verIndex);
  formData.append("arc_index", selectedProject.arcIndex);
  formData.append("project_index", selectedProject.projectIndex);
  files.forEach((file) => {
    addFile(file, formData);
  });
  return formData;
};

/**
 * Agrega el archivo al form-data y lo elimina del dropzone
 * @param {File} file archivo XML
 * @param {FormData} formData objeto form-data
 */
const addFile = (file, formData) => {
  formData.append("file", file.file, file.meta.name);
  file.remove();
};

export { manageElementsSubmit, manageElementsUpdate, manageUpdatedResponse };
