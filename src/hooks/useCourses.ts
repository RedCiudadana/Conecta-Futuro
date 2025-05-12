import { useState, useEffect } from 'react';
import { Course } from '../types/course';
import { courseService } from '../services/courseService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Error loading courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCourse = (course: Course) => {
    try {
      courseService.createCourse(course);
      setCourses(courseService.getAllCourses());
    } catch (err) {
      setError('Error adding course');
    }
  };

  const updateCourse = (id: string, course: Partial<Course>) => {
    try {
      courseService.updateCourse(id, course);
      setCourses(courseService.getAllCourses());
    } catch (err) {
      setError('Error updating course');
    }
  };

  const deleteCourse = (id: string) => {
    try {
      courseService.deleteCourse(id);
      setCourses(courseService.getAllCourses());
    } catch (err) {
      setError('Error deleting course');
    }
  };

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse
  };
};