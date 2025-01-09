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
<<<<<<< HEAD
    console.log('response', response.data.batchModuleSchedule);
    return response.data.batchModuleSchedule || [];
=======
    console.log('response', response.data.data);
    return response.data.data || [];
>>>>>>> 18a96ced52c2973ba4c2022cbc1b897d1775c9a6
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
<<<<<<< HEAD
    console.log('response', response.data);
=======
    console.log('response batch module', response.data.data);
>>>>>>> 18a96ced52c2973ba4c2022cbc1b897d1775c9a6
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
<<<<<<< HEAD
};
=======
};
>>>>>>> 18a96ced52c2973ba4c2022cbc1b897d1775c9a6
