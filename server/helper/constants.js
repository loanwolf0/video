const messages = {
    GURU_DELETED: 'Guru Deleted Successfully!',
    GURU_UPDATED: 'Guru Updated Successfully!',
    SESSION_ENDED: "Session Ended",
    DUPLICATE_SESSION: "Session has been started already",
    NO_ACTIVE_SESSION: "No Active Session Found!",
    USER_NOT_EXIST: "User not found",
    SESSION_REVOKED: "Session Revoked Successfully!",
    INTERNAL_SERVER_ERROR: "Internal Server Error, please try again after an hour!",
    USER_VERIFIED: "User Verified Successfully",
    PLAN_CHANGED: "Plan Changed Successfully",
    INVALID_VERIFICATION_LINK: "Verification Link is not valid!",
    VERIFICATION_EMAIL_SENT: "Verification Email Sent Successfully!",
    VERIFY_EMAIL: "Please verify your email address",
    ANSWER_UPDATED: "Answer Updated Successfully!",
    RESET_EMAIL_SENT: "Password reset email has been sent successfully!",
    PASSWORD_UPDATED: "Password Updated Successfully!",
    SESSION_LIMIT_EXCEEDED: "You have reached the session limit for this month!",
    INVALIS_PROMOCODE: "Invalid Promo Code",
    RECORDING_DELETED: "Recording Deleted Successfully!",
    RECORDING_UPDATED: "Recording Updated Successfully!",
    SAVED_AS_DRAFT: "Saved As Draft Successfully!",
    SESSION_TOPIC_UPDATED: "Session Topics Updated Successfully!",
    EMAIL_EXISTS: "Email Already Exists!",
    TEMP_DOMAIN_USED: "Disposable Emails Not Allowed!",
    ORDER_CREATED: "Order Created Successfully!",
    PAYMENT_NOT_EXIST: "Payment not found",
    USED_GURU: "Guru is used for student",
    WRONG_PASSWORD:"Wrong Password.",
    PASSWORD_UPDATED: "Password Updated Successfully!",
    COURSE_TOPIC_MESSAGES : [
        "Course Created Successfully!", 
        "Topic Created Successfully!",
        "Course Deleted Successfully!"
    ],
    COURSE_SHARED :[
        "Mail Send Successfully!",
        "Link Copied.",
        "Create Guru to share the course."
    ],
    QUIZ_CREATED: "Quiz Created Successfully",
    QUIZ_DELETED: "Quiz Deleted Successfully",
    QUIZ_UPDATED: "Quiz Updated Successfully",
    QUIZ_FOUND: "Quiz Found For Given ID",
    PLAN_CREATED: "Plan Created Successfully",
    PLAN_UPDATED: "Plan Updated Successfully",
    PLAN_NAME_ALREADY_EXIST: "Plan name already exists",
    PLAN_DELETED: "Plan Deleted Successfully",

}

const httpStatus = {
    OK: 200,
    SERVER_ERROR: 500,
    UNAUTHORIZED: 401
}

const emailTypes = {
    VERIFY_EMAIL: "verifyEmail",
    RESET_PASSWORD: "resetPassword",
    INTERNAL_EMAIL: "internalEmail",
    SHARE_COURSE: "shareCourse"
}

const TRAINING_STEPS = {
    STEP_1: 'training-information',
    STEP_2: 'course-videos',
    STEP_3: 'faqs',
    STEP_4: 'avatar-information'
}

const PLAN_SESSIONS = {
    FREE_TRIAL: '2',
    BASIC: '5',
    PREMIUM: '10',
    ELITE: '25',
}

const TOPIC_TYPE = {
    COURSE:"COURSE",
    TOPIC:"TOPIC"
}
module.exports = {
    messages,
    httpStatus,
    emailTypes,
    TRAINING_STEPS,
    PLAN_SESSIONS,
    TOPIC_TYPE
}