import apiClient from './apiClient';

// Create a new course category
export const createBatchModuleScheduleApi = async (newBatchModuleSchedule: any) => {
  try {
    const response = await apiClient.post('/batchModuleSchedule', newBatchModuleSchedule);
    return response.data;
  } catch (error) {
    console.error('Error creating course module', error);
    throw error;
  }
};

// Read all course categories
export const fetchBatchModuleScheduleApi = async () => {
  try {
    const response = await apiClient.get('/batchModuleSchedule');
    console.log('responseschedule', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch course module', error);
    throw error;
  }
};

// Update an existing course category
export const updateBatchModuleScheduleApi = async (id: number, newBatchModuleSchedule: any) => {
  try {
    console.log('updatedCourseModule', newBatchModuleSchedule);
    const response = await apiClient.put(`/batchModuleSchedule/${id}`, newBatchModuleSchedule);
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating course module', error);
    throw error;
  }
};

// Delete a course category
export const deleteBatchModuleScheduleApi = async (id: number) => {
  try {
    const response = await apiClient.delete(`/batchModuleSchedule/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete course module', error);
    throw error;
  }
}