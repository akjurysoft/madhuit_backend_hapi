// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Student"];
const {
    SchoolControllers
} = require('../controllers')
const { headerValidator, StudentValidators } = require('../validators');

const student_routes = [
    {
        method: "POST",
        path: "/student/add",
        options: {
            description: "Create a new studnet by Admin.",
            tags,
            validate: {
                headers: headerValidator,
            },
            handler: SchoolControllers.createSchool,
        },
    },
    {
        method: "POST",
        path: "/student/update/{student_id}",
        options: {
            description: "Update a student by Admin.",
            tags,
            validate: {
                headers: headerValidator,
            },
            handler: SchoolControllers.updateSchool,
        },
    },
    {
        method: "POST",
        path: "/student/delete/{student_id}",
        options: {
            description: "Deleting single student by Admin.",
            tags,
            validate: {
                headers: headerValidator,
            },
            handler: SchoolControllers.deleteSingleSchool,
        },
    },
    {
        method: "GET",
        path: "/student/{school_id}/{student_id}",
        options: {
            description: "Fetching single student.",
            tags,
            validate: {
                headers: headerValidator,
                params: StudentValidators.single_student_param,
            },
            handler: SchoolControllers.fetchSingleSchool,
        },
    },
    {
        method: "GET",
        path: "/student/{school_id}",
        options: {
            description: "Fetching all students.",
            tags,
            validate: {
                headers: headerValidator,
                params: StudentValidators.single_school_students_param
            },
            handler: SchoolControllers.fetchSchools,
        },
    },
]

module.exports = student_routes