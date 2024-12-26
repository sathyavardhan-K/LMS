// src/api/courseApi.ts
import apiClient from './apiClient';

// Create a new course
export const createCourseApi = async (courseData: any) => {
  try {
    const response = await apiClient.post('/course', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course', error);
    throw error;
  }
};

// Read all courses
export const fetchCourseApi = async () => {
  try {
    const response = await apiClient.get('/course');
    return response.data.course || [];
  } catch (error) {
    console.error('Failed to fetch courses', error);
    throw error;
  }
};

// Update an existing course
export const updateCourseApi = async (courseId: number, courseData: any) => {
  try {
    const response = await apiClient.put(`/course/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error updating course data', error);
    throw error;
  }
};

// Delete a course
export const deleteCourseApi = async (courseId: number) => {
  try {
    const response = await apiClient.delete(`/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete course', error);
    throw error;
  }
};
