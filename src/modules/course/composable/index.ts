import { onMounted, reactive, ref } from 'vue'
import CourseService from '@modules/course/service'
import { ICourse, ICreateCourse } from '@modules/course/interfaces'
import { IUser } from '@/interfaces'

const courseList = ref<ICourse[]>([])
const allTeacherByCourse = ref<IUser[]>([])
const teacherList = ref<IUser[]>([])
const newCourse = reactive<ICreateCourse>({
  name: '',
  teacherId: -1,
})
const courseTeacher = ref<IUser>()

export function useCourse() {
  onMounted(() => {
    getAll()
  })

  function getAll() {
    CourseService.fetchAllCourse().then(listCourse => {
      console.log(listCourse)
      courseList.value = listCourse
      courseList.value.forEach(course => {
        course.teacherList = []

        // TODO
        course.courseTeacherList.forEach(async teacherId => {
          // const findTeacherList = teacherList.value.filter(teacher => teacher.id === teacherId)
          // if (findTeacherList.length === 0) {
          const teacher = await getTeacherList(teacherId)
          teacherList.value.push(teacher)
          course.teacherList = [teacher]
          // } else {
          // course.teacherList = [...findTeacherList]
          // }
        })
      })
    })
  }

  function saveCourse() {
    if (!courseTeacher.value) return

    newCourse.teacherId = courseTeacher.value.id
    CourseService.saveCourse(newCourse).then(() => {})
  }

  async function getTeacherList(teacherId: number) {
    return await CourseService.fetchUserById(teacherId)
  }

  function getAllTeacherByCourse() {
    CourseService.fetchAllTeacher().then(teacherList => {
      allTeacherByCourse.value = teacherList
    })
  }

  return {
    courseList,
    teacherList,
    newCourse,
    getAllTeacherByCourse,
    saveCourse,
    allTeacherByCourse,
    courseTeacher,
  }
}
