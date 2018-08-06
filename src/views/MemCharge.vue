<template>
    <section>
        
        <!--工具条-->
        <el-col :span="24" v-show="listDisplay" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="searchForm" label-position="right" label-width="120px" ref="searchForm" :inline="true">
                <el-input :model="searchForm.page" type="hidden"  ></el-input>
                <el-input :model="searchForm.pageSize" type="hidden"></el-input>
                <el-form-item label="订单号">
                    <el-input v-model="searchForm.orderNo"  placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="searchForm.memName"  placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号">
                    <el-input v-model="searchForm.cardNo"  placeholder="卡号"></el-input>
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
                    <el-button type="primary" @click="toRecharge">充值</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table v-show="listDisplay" :data="memCourseList2" border stripe highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
            
            <el-table-column prop="orderNo" label="订单编号">
            </el-table-column>
            <el-table-column prop="cardNo" label="会员卡号" >
            </el-table-column>
            <el-table-column prop="memName" label="姓名">
            </el-table-column>
            <el-table-column prop="courseName" label="课程名称" >
            </el-table-column>
            <el-table-column prop="coachName" label="教练" >
            </el-table-column>

            <el-table-column prop="unitPrice" label="课时单价" >
            </el-table-column>
            <el-table-column prop="totalNum" label="总课时" >
            </el-table-column>
            <el-table-column prop="freeNum" label="剩余课时" >
            </el-table-column>
            <el-table-column prop="usedNum" label="已耗课时" >
            </el-table-column>
            <el-table-column prop="actualAmount" label="实际价格" >
            </el-table-column>
            <el-table-column prop="discountAmount" label="优惠" >
            </el-table-column>
            <el-table-column prop="courseAmount" label="总价" >
            </el-table-column>
        </el-table>
        <!--工具条-->
        <pagination v-show="listDisplay" @search="pageSearch" :total="total" :currentPage = "page"></pagination>
        <!--充值-->
        <el-form v-show="addFormDisplay" :model="addForm" label-width="100px" :rules="addFormRules" style="display:none" :display="addFormDisplay" ref="addForm" >
            <el-form-item label="卡号" prop="memId">
                <el-col :span="24">
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
                </el-col>
            </el-form-item>
			<el-form-item label="充值课程">
                <el-col :span="24">
                    <template scope>
                        <Recharge  @addMemCourse="addMemCourse" @refreshSelectedCourses="refreshSelectedCourses" :memCourselist="selectedCourseList" ></Recharge>
                    </template>
                </el-col>
            </el-form-item>		
			<el-form-item>
                <el-col :span="24">
                    <el-button plain  @click.native="cancelSubmit">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>	
                </el-col>
			</el-form-item>
		</el-form>
			
    </section>
</template>
<script>
import 
{ urlGetMemberList,urlPayCourse,urlAllMemCourseList} from "../api/req_member";
import {urlGetGymCourseList} from '../api/req_course'
import util from '../common/js/util'
import Pageination from '../components/pagination'
import Recharge from './Recharge'

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
                    { required: true, message: '请选择充值人', trigger: 'blur' },
                ]
            },
            addForm:{},
            addFormDisplay:false,
            listDisplay:true,
           
            memCourseList2:[],
            searchForm: {
                orderNo:'',
                memName:'',
                cardNo:'',
                courseName:'',
                page:1,
                pageSize:20,
                dateStart:'',
                dateEnd:''
            },
            total:0,
            page:1,
            pageSize:10,
        }
    },
    methods:{
         memChange:function(val){
            let curMem = util.getItemByValue(val,this.memberList)
            this.addForm.cardNo = curMem.cardNo;
            this.addForm.memName = curMem.name;
            this.addForm.memId = curMem.id;
        },
        addMemCourse:function(){
            this.selectedCourseList.push({courseList:this.courseList,coachList:[],courseAmountArr:'',actualAmount:'',courseName:'',coachNo:'',coachName:''})
        },
        refreshSelectedCourses:function(selectedCourseList){
            if(!selectedCourseList){
                return;
            }
            this.addForm.courseIdArr=[]
            this.addForm.courseNameArr = []
            this.addForm.coachIdArr=[]
            this.addForm.coachNoArr = []
            this.addForm.coachNameArr = []
            this.addForm.totalNumArr=[]
            this.addForm.courseAmountArr=[]
            this.addForm.unitPriceArr = []
            this.addForm.discountAmountArr = []
           
            selectedCourseList.forEach(item => {
                this.addForm.courseIdArr.push(item.courseIdArr)
                this.addForm.courseNameArr.push(item.courseName)
                this.addForm.coachIdArr.push(item.coachIdArr)
                this.addForm.coachNoArr.push(item.coachNo)
                this.addForm.coachNameArr.push(item.coachName)
                this.addForm.totalNumArr.push(item.totalNumArr)
                this.addForm.courseAmountArr.push(item.courseAmountArr)	
                this.addForm.unitPriceArr.push(item.unitPrice) 
                this.addForm.discountAmountArr.push(item.discountAmount)  
            });
        },  
        // 根据输入内容搜索
        queryMemberListByParam:function(queryStr){
            if (queryStr !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.selMemList = this.memberList.filter(item => {
                    return item.cardNo
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
        initGymCourseList:function(){
            this.$http.post(urlGetGymCourseList, {}, res => {
			if(res && res.data && 'A_SYS_00010' === res.data.code){
				this.courseList = res.data.data;
			}else{
				this.courseList = [];
			}

		});
        },
        pageSearch:function(pageination){
			this.page = pageination.page;
			this.pageSize = pageination.pageSize;
			this.total = pageination.total;
			this.queryAllChargeList()
	    },
        resetSearchFrom:function(formName){
            this.$refs['searchForm'].resetFields();
        },
        //获取用户列表
        queryAllChargeList: function() {
            this.searchForm.page = this.page;
            this.searchForm.pageSize = this.pageSize;
            let para = Object.assign({}, this.searchForm);
            this.listLoading = true;
            // 请求后台
            this.$http.post(urlAllMemCourseList, para, res => {
                if(res.data.code =='A_SYS_00010'){
                        this.memCourseList2 = res.data.data.rows;
                        this.total = res.data.data.total;
                        this.page = res.data.data.page;
                        
                }else{
                        this.memCourseList2 = []
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
            this.queryAllChargeList();
        },
        toRecharge:function(){
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
                        this.$http.post(urlPayCourse, para, res => {
                            this.addLoading = false;
                            if(res && res.data && res.data.code === 'A_SYS_00010'){
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                // 跳转至用户列表
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
        this.queryAllChargeList();
        this.initMemberList();
        this.initGymCourseList();
        
    },
    components:{
        'Recharge':Recharge,
        'pagination':Pageination,
     }
}
</script>

