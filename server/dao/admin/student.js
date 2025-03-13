const { default: mongoose, Types } = require('mongoose');
const model = require('../../models')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getStudentsCounts = async function (title) {

    const searchQuery = {
        userType: "student"
    };

    if (title && title != "") {
        // Ensure title exists and is not empty
        const terms = title.trim().split(' ');
        if (terms.length > 1) {
            searchQuery.$and = searchQuery.$and || [];
            searchQuery.$and.push(
                { firstName: new RegExp(terms[0], 'i') },
                { lastName: new RegExp(terms[1], 'i') }
            );
        } else {
            searchQuery.$or = [
                { firstName: new RegExp(title, 'i') },
                { lastName: new RegExp(title, 'i') },
            ];
        }
    }

    return await model.user.countDocuments(searchQuery);
};


module.exports.getStudents = async function (skip, limit, title) {

    const searchQuery = {
        userType: "student"
    };

    if (title && title != "") {
        // Ensure title exists and is not empty
        const terms = title.trim().split(' ');
        if (terms.length > 1) {
            searchQuery.$and = searchQuery.$and || [];
            searchQuery.$and.push(
                { firstName: new RegExp(terms[0], 'i') },
                { lastName: new RegExp(terms[1], 'i') }
            );
        } else {
            searchQuery.$or = [
                { firstName: new RegExp(title, 'i') },
                { lastName: new RegExp(title, 'i') },
            ];
        }
    }

    const aggregateQuery = [
        {
            $match: searchQuery
        },
        // {
        //     $lookup: {
        //         from: "plans",
        //         localField: "planId",
        //         foreignField: "_id",
        //         as: "planDetails"
        //     }
        // },
    ];

    return await model.user.aggregate(aggregateQuery);
};

module.exports.getStudentDetails = async function (studentId) {
    const searchQuery = {
        _id: studentId
    };

    const aggregateQuery = [
        {
            $match: searchQuery
        },
        // {
        //     $lookup: {
        //         from: "plans",
        //         localField: "planId",
        //         foreignField: "_id",
        //         as: "planDetails"
        //     }
        // },
        // {
        //     $lookup: {
        //         from: "courses",
        //         let: { teacherId: "$_id" },
        //         pipeline: [
        //             {
        //                 $match: {
        //                     $expr: {
        //                         $and: [
        //                             { $eq: ["$uid", "$$teacherId"] },
        //                             { $ne: ["$deleteStatus", true] }
        //                         ]
        //                     }
        //                 }
        //             }
        //         ],
        //         as: "courseDetails"
        //     }
        // }
    ];

    return await model.user.aggregate(aggregateQuery);
};

module.exports.updateStudent = async function (studentId, updateData) {
    return await model.user.findByIdAndUpdate(studentId, { $set: updateData }, { new: true });
}
