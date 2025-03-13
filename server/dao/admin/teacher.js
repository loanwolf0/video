const { default: mongoose, Types } = require('mongoose');
const model = require('../../models')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getTeachersCounts = async function (searchParams) {
    const searchQuery = { userType: "teacher" };

    if (searchParams.title) {
        searchQuery["firstName"] = { $regex: new RegExp(searchParams.title, 'i') };
    }

    return await model.user.countDocuments(searchQuery);
};


module.exports.getTeachers = async function (skip, limit, title) {
    
    const searchQuery = {
        userType: "teacher"
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
        {
            $lookup: {
                from: "plans",
                localField: "planId",
                foreignField: "_id",
                as: "planDetails"
            }
        },
    ];

    return await model.user.aggregate(aggregateQuery);
};

module.exports.getTeacherDetails = async function (teacherId) {
    const searchQuery = {
        _id: teacherId
    };

    const aggregateQuery = [
        {
            $match: searchQuery
        },
        {
            $lookup: {
                from: "plans",
                localField: "planId",
                foreignField: "_id",
                as: "planDetails"
            }
        },
        {
            $lookup: {
                from: "courses",
                let: { teacherId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$uid", "$$teacherId"] },
                                    { $ne: ["$deleteStatus", true] }
                                ]
                            }
                        }
                    }
                ],
                as: "courseDetails"
            }
        }
    ];

    return await model.user.aggregate(aggregateQuery);
};

module.exports.updateTeacher = async function (teacherId, updateData) {
    return await model.user.findByIdAndUpdate(teacherId, { $set: updateData }, { new: true });
}
