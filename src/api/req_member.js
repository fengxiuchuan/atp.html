// 查询会员列表
const urlMemberList = '/atpMember/queryAllList.json'
// 新增会员
const urlAddMember = '/atpMember/addMem.do'
// 更新会员
const urlUpdateMember = '/atpMember/updateMem.do'
// 查看详情
const urlGetMemById = '/atpMember/getMemById.json'

// 查看会员所报课程
const urlGetCourseListByMemId = '/atpMember/queryCourseListByMemId.json'

// 查询所有会员
const urlGetMemberList = '/atpMember/getMemberList.json'

// 会员充值服务
const urlPayCourse = '/atpMember/payCourse.do'

// 会员销课
const urlConsumeCourse = '/atpMember/consumeCourse.do'

// 增值列表
const urlAllMemCourseList = '/atpMember/queryMemCourseList.json'
// 课耗列表
const urlAllMemConsumeList = '/atpMember/queryConsumeList.json'
// 校验课程
const urlAuthPwd = '/atpMember/authPwd.do'

export { urlMemberList, urlAddMember, urlUpdateMember, urlGetMemById, urlGetCourseListByMemId, urlGetMemberList, urlPayCourse, urlConsumeCourse,
    urlAllMemConsumeList, urlAllMemCourseList,urlAuthPwd }
