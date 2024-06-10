import { loadCoursesAsync } from '@/services/state/courses/coursesThunks';
import { AppDispatch, RootState } from '@/services/state/store';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const useLoadCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const courses = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    dispatch(loadCoursesAsync());
  }, [dispatch]);

  const unitsFinished = courses.data.reduce((acc, course) => {
    return acc + course.units.unitsFinished;
  }, 0);

  const unitsTotal = courses.data.reduce((acc, course) => {
    return acc + course.units.unitsTotal;
  }, 0);

  const progressNum = (unitsFinished / unitsTotal) * 100;

  return { courses, progressNum };
};
