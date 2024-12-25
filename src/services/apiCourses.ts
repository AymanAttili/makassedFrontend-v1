import { AxiosError } from "axios";
import axiosAPI from "../API/axiosAPI";
import { addFile } from "./apiFiles";

export async function getCourse(courseId: string){
    return await axiosAPI.get(`/courses/${courseId}`)
}

export async function searchCourses(query){
    return await axiosAPI.post(`/courses/search`, query)
}

export async function checkCourseFinish(courseId: string){
    return await axiosAPI.get(`/courses/${courseId}/is-finished`)
}

export async function createCourse(payload){
    return await axiosAPI.post(`/courses`, payload);
}

export async function editCourse(courseId: string, payload){
    return await axiosAPI.put(`/courses/${courseId}`, payload);
}

export async function deleteCourse(courseId: string){
    return await axiosAPI.delete(`/courses/${courseId}`);
}

export async function assignStaffToCourse(courseId: string, assignments: number[]){
    return await axiosAPI.put(`/courses/${courseId}/assignments`, {assignments});
}

export async function startCourse(courseId: string){
    return await axiosAPI.post(`/courses/${courseId}/start`);
}

export async function finishCourse(courseId: string){
    return await axiosAPI.post(`/courses/${courseId}/finish`);
}


////////////////////////////////////////////////////////////////////////////////////////////
// Section
////////////////////////////////////////////////////////////////////////////////////////////

export async function addSection(courseId: string, payload){
    return await axiosAPI.post(`/courses/${courseId}/sections`, payload);
}

export async function getSection(courseId: string, sectionId: string){
    return await axiosAPI.get(`/courses/${courseId}/sections/${sectionId}`);
}

export async function editSection(courseId: string, sectionId: string, payload){ // TODO: verifying that it patches not posts
    return await axiosAPI.put(`/courses/${courseId}/sections/${sectionId}`, payload);
}

export async function deleteSection(courseId: string, sectionId: string){
    return await axiosAPI.delete(`/courses/${courseId}/sections/${sectionId}`);
}


////////////////////////////////////////////////////////////////////////////////////////////
// SectionPart
////////////////////////////////////////////////////////////////////////////////////////////

export async function addSectionPart(sectionId: string, payload){
    const { materialType, file, title, link, questions } = payload;
    
    let newPayload = {
        title,
        materialType
    }

    if(materialType === 'File'){
        const fileId : string =  (await addFile(file)).data.fileId
        newPayload = {
            ...newPayload,
            fileId
        }
    }

    else if(materialType === 'Link'){
        newPayload = {
            ...newPayload,
            link
        }
    }
    else if(materialType === 'Exam'){
        newPayload = {
            ...newPayload,
            questions
        }
    }

    else{
        return new AxiosError('Invalid Material Type')
    }

    return await axiosAPI.post(`/sections/${sectionId}/parts`, newPayload);
}

export async function getSectionPart(sectionId: string, sectionPartId: string){
    return await axiosAPI.get(`/sections/${sectionId}/parts/${sectionPartId}`);
}

export async function editSectionPart(sectionId: string, sectionPartId: string, payload){ // TODO: Error 500
    const { materialType, file, title, link, questions } = payload;
    
    let newPayload = {
        title,
        materialType
    }

    if(materialType === 'File' && file){
        const fileId : string =  (await addFile(file)).data.fileId
        newPayload = {
            ...newPayload,
            fileId
        }
    }

    else if(materialType === 'Link'){
        newPayload = {
            ...newPayload,
            link
        }
    }
    else if(materialType === 'Exam'){
        newPayload = {
            ...newPayload,
            questions
        }
    }

    else{
        return new AxiosError('Invalid Material Type')
    }

    return await axiosAPI.put(`/sections/${sectionId}/parts/${sectionPartId}`, newPayload);
}

export async function deleteSectionPart(sectionId: string, sectionPartId: string){
    return await axiosAPI.delete(`/sections/${sectionId}/parts/${sectionPartId}`);
}

export async function toggleSectionPartStatus(sectionId: string, sectionPartId: string){
    return await axiosAPI.patch(`/sections/${sectionId}/parts/${sectionPartId}/current-user/done`);
}

export async function submitExam(sectionId: string, sectionPartId: string, payload){
    return await axiosAPI.put(`/sections/${sectionId}/parts/${sectionPartId}/current-user/status`, payload);
}
