// describe routes here by creating objects inside the user_routes array
const tags = ["api", "School"];
const {
    SchoolControllers
} = require('../controllers')
const { headerValidator, SchoolValidators } = require('../validators');

const school_routes = [
    {
        method: "POST",
        path: "/school/add",
        options: {
            description: "Create a new school by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                payload: SchoolValidators.create_school_payload
            },
            handler: SchoolControllers.createSchool,
        },
    },
    {
        method: "POST",
        path: "/school/update/{school_id}",
        options: {
            description: "Update a school by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                payload: SchoolValidators.update_school_payload,
                params: SchoolValidators.single_school_param,
            },
            handler: SchoolControllers.updateSchool,
        },
    },
    {
        method: "POST",
        path: "/school/delete/{school_id}",
        options: {
            description: "Deleting single school by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                params: SchoolValidators.single_school_param,
            },
            handler: SchoolControllers.deleteSingleSchool,
        },
    },
    {
        method: "GET",
        path: "/school/{school_id}",
        options: {
            description: "Fetching single school.",
            tags,
            validate: {
                headers: headerValidator,
                params: SchoolValidators.single_school_param,
            },
            handler: SchoolControllers.fetchSingleSchool,
        },
    },
    {
        method: "GET",
        path: "/school",
        options: {
            description: "Fetching all schools.",
            tags,
            validate: {
                headers: headerValidator,
            },
            handler: SchoolControllers.fetchSchools,
        },
    },
]

module.exports = school_routes