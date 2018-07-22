<template>
    <section>
        <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" >
			    <el-row>
					<el-col :span="24">
						<el-form-item label="卡号" prop="memId">
							<el-select v-model="addForm.memId" 
                                filterable
                                remote
                                reserve-keyword
                                :remote-method="queryMemberListByParam"
                                :loading="loading" 
                                @change="memChange"
                                placeholder="请输入待充值卡号/姓名/电话">
								<el-option
                                    v-for="item in selMemList"
                                    :key="item.id"
                                    :label="item.cardNo"
                                    :value="item.id" >
                                <div>
                                    <span style="float: left;backgroud-color:#fff">卡号：{{ item.cardNo }}</span>
                                    &nbsp;&nbsp;&nbsp;
                                    <span >姓名：{{ item.name }}</span>
                                     &nbsp;&nbsp;&nbsp;
                                    <span style="float: right; color: #8492a6; font-size: 13px">联系方式：{{ item.phone }}</span>
                                </div>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				
				</el-row>
				
				<el-row>
					<el-col :span="24">
						<el-form-item label="销课课程">
							<template scope>
								<Consume  @addMemCourse="addMemCourse" @refreshSelectedCourses="refreshSelectedCourses" :memCourselist="selectedCourseList" ></Consume>
							</template>
						</el-form-item>
					</el-col>
					
				</el-row>
                <el-row>
                    <el-col :span="4" style="float:right">
                        <el-button plain>取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </el-col>
                </el-row>
			</el-form>
			
    </section>
</template>
<script>
import 
{ urlGetMemberList,urlConsumeCourse,urlGetCourseListByMemId} from "../api/req_member";
import {urlGetGymCourseList} from '../api/req_course'
import util from '../common/js/util'
import Pageination from '../components/pagination'
import Consume from './Consume'
export default {
    data:function(){
        return {
            selectedCourseList:[],
            memberList:[],
            selMemList:[],
            courseList:[],
            loading:false,
            addLoading:false,
            addFormRules:{
                memId:[
                    { required: true, message: '请选择需要销课的会员', trigger: 'blur' },
                ]
            },
            addForm:{
               
            }
        }
    },
    methods:{
        addMemCourse:function(){
            let memId = this.addForm.memId;
            if(memId){// 不为空 可以添加
                this.selectedCourseList.push(
                    {
                    courseList:this.courseList,
                    coachList:[],
                    courseName:'',
                    actualAmount:'',
                    totalNum:'',
                    freeNum:'',
                    unitPrice:'',
                    coachId:'',
                    coachNo:'',
                    coachName:'',
                    courseNum:'',
                    integral:'',
                    execCoachId:'',
                    execCoachNo:'',
                    execCoachName:''
                    })
                    console.log(this.selectedCourseList)
            }else{// 为空：提示选择会员，清空销课课程
                this.$message({
                    message: '请先选择需要销课的会员',
                    type: 'warning'
                })
                this.selectedCourseList = []
            }
            
        },
        refreshSelectedCourses:function(selectedCourseList){
            if(!selectedCourseList){
                return;
            }
            this.addForm.memCourseIdArr = []
            this.addForm.courseIdArr = []
            this.addForm.courseNameArr   =[]
            this.addForm.coachIdArr      =[]
            this.addForm.coachNoArr      =[]
            this.addForm.coachNameArr    =[]
            this.addForm.courseNumArr      =[]
            this.addForm.integralArr     =[]
            this.addForm.execCoachIdArr  =[]
            this.addForm.execCoachNoArr  =[]
            this.addForm.execCoachNameArr=[]
            this.addForm.unitPriceArr=[]
            selectedCourseList.forEach(item => {
                this.addForm.memCourseIdArr.push(item.memCourseId);
                this.addForm.courseIdArr.push(item.courseId);
                this.addForm.courseNameArr.push(item.courseName);
                this.addForm.coachIdArr.push(item.coachId);
                this.addForm.coachNoArr.push(item.coachNo);
                this.addForm.coachNameArr.push(item.coachName);
                this.addForm.courseNumArr.push(item.courseNum);
                this.addForm.integralArr.push(item.integral);
                this.addForm.execCoachIdArr.push(item.execCoachId);
                this.addForm.execCoachNoArr.push(item.execCoachNo);
                this.addForm.execCoachNameArr.push(item.execCoachName);
                this.addForm.unitPriceArr.push(item.unitPrice);
            });
        },  
        // 根据输入内容搜索
        queryMemberListByParam:function(queryStr){
            if (queryStr !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.selMemList = this.memberList.filter(item => {
                    return item.cardNo.toLowerCase()
                        .indexOf(queryStr.toLowerCase()) > -1 
                        || item.name.indexOf(queryStr.toLowerCase()) > -1 
                        || item.phone.indexOf(queryStr.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.selMemList = [];
            }
        }, 
        initMemberList:function(){
            this.$http.post(urlGetMemberList, {}, res => {
                if(res && res.data && 'A_SYS_00010' === res.data.code){
                    this.memberList = res.data.data;
                }else{
                    this.memberList = [];
                }

            });
        },
        initMemCourseList:function(memId){
            let para = {memberId:memId}
            this.$http.get(urlGetCourseListByMemId,para, res => {
                if(res && res.data && 'A_SYS_00010' === res.data.code){
                    this.courseList = res.data.data.filter(course => course.freeNum > 0);
                }else{
                    this.courseList = [];
                }

            });
        },
        memChange:function(val){
            this.initMemCourseList(val); 
            // 获取当前的会员
            let curMem = util.getItemByValue(val,this.memberList)
            this.addForm.memCardNo = curMem.cardNo;
            this.addForm.memName = curMem.name;

        },
        addSubmit:function(){
            this.$refs['addForm'].validate((valid) => {
                if(valid){
                    this.$confirm("确认提交么？",'提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info '
                    }).then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        this.$http.post(urlConsumeCourse, para, res => {
                            this.addLoading = false;
                            if(res && res.data && res.data.code === 'A_SYS_00010'){
                               this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                // 跳转至销课成功
                                this.$router.push({ path: '/chargeSuc' })
                                
                            }else{
                                this.$message({
                                    message: res.data.msg,
                                    type: 'warning'
                                });
                            }

                        });
                    })
                }
            })
        }
    },
    mounted(){
        this.initMemberList();
       
    },
    components:{
		'Consume':Consume
     }
}
</script>

