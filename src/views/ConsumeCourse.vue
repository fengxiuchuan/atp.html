<template>
    <section>
        <!--工具条-->
        <el-col :span="24" v-show="listDisplay" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="searchForm" label-position="right" label-width="120px" ref="searchForm" :inline="true">
                <el-input :model="searchForm.page" type="hidden"  ></el-input>
                <el-input :model="searchForm.pageSize" type="hidden"></el-input>
                <el-form-item label="消费订单号">
                    <el-input v-model="searchForm.consumeNo"  placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="searchForm.memName"  placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号">
                    <el-input v-model="searchForm.memCardNo"  placeholder="卡号"></el-input>
                </el-form-item>
                <el-form-item label="课程名称">
                    <el-input v-model="searchForm.courseName"  placeholder="课程名称"></el-input>
                </el-form-item>
                <el-form-item label="时间选择">
                    <el-date-picker type="date" placeholder="开始日期" v-model="searchForm.dateStart" style="width:202px"></el-date-picker>
                </el-form-item>
                <el-form-item label="-">
                    <el-date-picker type="date" placeholder="结束日期" v-model="searchForm.dateEnd" style="width:202px"></el-date-picker>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button icon="el-icon-search" type="primary" v-on:click="queryAllChargeList">查询</el-button>
                
                    <el-button type="primary" @click="resetSearchFrom('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col v-show="listDisplay" :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="toConsume">销课</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table v-show="listDisplay" :data="memConsumeList" border stripe highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
            <el-table-column prop="consumeNo" label="消费订单编号">
            </el-table-column>
            <el-table-column prop="cardNo" label="会员卡号" >
            </el-table-column>
            <el-table-column prop="memName" label="姓名">
            </el-table-column>
            <el-table-column prop="courseName" label="课程名称" >
            </el-table-column>
            <el-table-column prop="coachName" label="教练" >
            </el-table-column>
            <el-table-column prop="execCoachName" label="执行教练" >
            </el-table-column>
            <el-table-column prop="courseNum" label="消耗课时" >
            </el-table-column>
            <el-table-column prop="integral" label="积分" >
            </el-table-column>
            <el-table-column prop="consumeTime" label="消耗时间">
            </el-table-column>
        </el-table>
        <!--工具条-->
        <pagination v-show="listDisplay" @search="pageSearch" :total="total" :currentPage = "page"></pagination>

        <el-form v-show="addFormDisplay" :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" >
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
                        <el-button type="primary" @click.native="cancelSubmit">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </el-col>
                </el-row>
			</el-form>
			
    </section>
</template>
<script>
import 
{ urlGetMemberList,urlConsumeCourse,urlGetCourseListByMemId,urlAllMemConsumeList} from "../api/req_member";
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
            listLoading:false,
            addFormRules:{
                memId:[
                    { required: true, message: '请选择需要销课的会员', trigger: 'blur' },
                ]
            },
            addForm:{
               
            },
            addForm:{},
            addFormDisplay:false,
            listDisplay:true,
            memConsumeList:[],
            searchForm: {
                consumeNo:'',
                memCardNo:'',
                memName:'',
                courseName:'',
                page:1,
                pageSize:10,
                dateStart:'',
                dateEnd:''
            },
            total:0,
            page:1,
            pageSize:10,
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
        pageSearch:function(pageination){
			this.page = pageination.page;
			this.pageSize = pageination.pageSize;
			this.total = pageination.total;
			this.queryAllConsumeList()
	    },
        resetSearchFrom:function(formName){
            this.$refs['searchForm'].resetFields();
        },
        //获取用户列表
        queryAllConsumeList: function() {
            this.searchForm.page = this.page;
            this.searchForm.pageSize = this.pageSize;
            let para = Object.assign({}, this.searchForm);
            this.listLoading = true;
            // 请求后台
            this.$http.post(urlAllMemConsumeList, para, res => {
                if(res.data.code =='A_SYS_00010'){
                        this.memConsumeList = res.data.data.rows;
                        this.total = res.data.data.total;
                        this.page = res.data.data.page;
                        
                }else{
                        this.memConsumeList = []
                        this.total = 0;
                        this.page = 1;
                }
                
                this.listLoading = false;
            });
        },
        cancelSubmit:function(){
            this.$refs['addForm'].resetFields();
            this.listDisplay = true;
            this.addFormDisplay = false;
            this.queryAllConsumeList();
        },
        toConsume:function(){
            this.listDisplay = false;
            this.addFormDisplay = true;
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
        this.queryAllConsumeList();
       
    },
    components:{
		'Consume':Consume
     }
}
</script>

