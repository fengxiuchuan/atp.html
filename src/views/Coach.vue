<template>
    <section>
        <!--列表-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="searchForm" ref="searchForm" :inline="true">
                <el-input :model="searchForm.page" type="hidden" ></el-input>
                <el-input :model="searchForm.pageSize" type="hidden"></el-input>
                <el-form-item prop="coachName">
                    <el-input v-model="searchForm.coachName"  placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" v-on:click="getCoachList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetSearchFrom('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="coachList" highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column prop="coachName" label="姓名"  sortable>
            </el-table-column>
            <el-table-column prop="sex" label="性别" :formatter="parseSex" sortable>
            </el-table-column>
            <el-table-column prop="age" label="年龄"  sortable>
            </el-table-column>
            <el-table-column prop="birth" label="出生日期"  sortable>
             </el-table-column>
            <el-table-column prop="userAccount" label="用户名"  sortable>
            </el-table-column>
            <el-table-column prop="jobState" label="是否在职"  >
                 <template scope="scope">
                        <el-switch disabled
                            active-text ="是"
                            inactive-text = "否"
                            on-color="#5B7BFA"
                            off-color="#dadde5"
                            active-value="Y"
                            inactive-value="N"
                            v-model="scope.row.jobState"      
                        >
                        </el-switch>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" icon="el-icon-more" @click="handleDetail(scope.$index, scope.row)"></el-button>
                    <el-button size="small" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
		

		<!--工具条-->
		<pagination @search="pageSearch" :total="total" :currentPage = "page"></pagination>

		<!--新增/编辑界面-->
		<el-dialog :title="formTitle"  :visible.sync="addFormVisible" :close-on-click-modal="true">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
				<el-input type="hidden" v-model="addForm.id"></el-input>
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名" prop="coachName">
							<el-input  v-model="addForm.coachName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :span="12">
						<el-form-item label="性别" prop="sex">
							<el-radio-group    v-model="addForm.sex">
								<el-radio class="radio" :label="1">男</el-radio>
								<el-radio class="radio" :label="0">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
							<el-form-item label="年龄">
								<el-input-number   v-model="addForm.age" :min="0" :max="200"></el-input-number>
							</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="出生日期">
							<el-date-picker    type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
						</el-form-item>
					</el-col>
                    
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否在职" prop="jobState">
                            <el-radio-group    v-model="addForm.jobState">
                                <el-radio-button label="Y">是</el-radio-button>
                                <el-radio-button label="N">否</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
                        <el-form-item label="所在场馆" prop="gymId">
							<el-select v-model="addForm.gymId" filterable placeholder="请选择">
                                <el-option
                                v-for="item in gymList"
                                :key="item.id"
                                :label="item.gymName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
					</el-col>
				</el-row>
				<el-row>
                    <el-col :span="12">
                        <el-form-item label="用户名" prop="userAccount">
                            <el-input  v-model="addForm.userAccount" placeholder="请填写用户名"/>
                        </el-form-item>
                    </el-col>
					<el-col :span="24">
						<el-form-item label="用户密码" prop="userPasswd"> 
							<el-input    v-model="addForm.userPasswd" placeholder="用户密码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="项目" prop="courseIdArr">
                            <el-select v-model="addForm.courseIdArr"  multiple filterable placeholder="请选择">
                                <el-option
                                v-for="item in courseList"
                                :key="item.courseNo"
                                :label="item.courseName"
                                :value="item.courseNo">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="formSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        <!--新增页面-->

        <!--详情页面-->
        <el-dialog title="详情页面"  :visible.sync="detailVisible" :close-on-click-modal="true" :loadding="detailLoading">
            <el-form  label-width="100px" label-suffix="：" >
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名"  >
							<span v-text="coach.coachName" ></span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别">
							<span>{{coach.sex | parseSex}}</span>
						</el-form-item>
					</el-col>
					
				</el-row>
				<el-row>
					<el-col :span="12">
							<el-form-item label="年龄">
								<span v-text="coach.age"></span>
							</el-form-item>
					</el-col>
					
					<el-col :span="12">
						<el-form-item label="出生日期" >
							<span v-text=" coach.birth"></span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否在职">
                           <span>{{coach.jobState | parseJobState}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
                        <el-form-item label="所在场馆">
							<el-select v-model="coach.gymId" disabled filterable placeholder="请选择">
                                <el-option
                                v-for="item in gymList"
                                :key="item.id"
                                :label="item.gymName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户名" > 
							<span v-text="coach.userAccount"></span>
						</el-form-item>
					</el-col>
                    <el-col :span="12">
					<el-form-item label="项目">
                            <el-select v-model="coachCourseArr" disabled multiple filterable placeholder="请选择">
                                <el-option
                                v-for="item in courseList"
                                :key="item.courseNo"
                                :label="item.courseName"
                                :value="item.courseNo">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
				</el-row>
			</el-form>
             <div slot="footer" class="dialog-footer">
				    <el-button @click.native="detailVisible = false">关闭</el-button>
			    </div>
        </el-dialog>
    </section>
</template>
<script>
import 
{ 
 urlAddCoach, urlQueryAllList, urlQueryCourseByCoachId, urlQueryDetailById, urlUpdateCoach,urlDelCoachCourseById
 } from "../api/req_coach";
import {urlGetGymList} from '../api/req_gym'
import {urlGetCourseList} from '../api/req_course.js'
import {responeSucCode} from '../api/response'
import util from '../common/js/util'
import formUtil from '../common/js/formUitl'
import Pageination from '../components/pagination'

export default {
    data:function(){
        return {
            searchForm:{
                coachName:'',
                sex:-1
            },
            total:0,
            page:1,
            pageSize:20,
            coachList: [],
            courseList:[{courseNo:'',courseName:'请选择'}],
            gymList:[{id:-1,gymName:"请选择"}],
            formType:'add',
            formTypeObj:{
                add :'add',
                edit:'edit',
                view:'view'
            },
            listLoading:false,

            formTitle:'新增',
            addFormVisible:false,
            addLoading:false,
            addForm:{
                name:'',
                birth:'',
                age:'',
                sex:-1,
                jobState:'',
                gymId:'',
                userAccount:'',
                userPasswd:'',
                courseIdArr:[]
            },
            addFormRules:{
                coachName:[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, message: '长度在 2 个字符以上', trigger: 'blur' }
                ],
                

                
            },
            formNameObj:{
                addForm :"addForm",
                searchForm: "searchForm"
            },
            coach:{
                name:'',
                birth:'',
                age:'',
                sex:-1,
                jobState:'',
                gymId:-1,
                userAccount:'',
                userPasswd:'',
                courseIdArr:[]
            },
            detailVisible:false,
            detailLoading:false,
            coachCourseArr:[]
        }
    },
    filters:{
        parseJobState:function(jobState){
            return jobState == 'Y'? "是": jobState == 'Y' ?"否":"未知";
        },
        parseSex: function(sex) {
            return sex == 1 ? "男" : sex == 0 ? "女" : "未知";
        },
    },
    methods:{
        //1 列表
        getCoachList:function(){
            this.searchForm.page = this.page;
            this.searchForm.pageSize = this.pageSize;
            let para = Object.assign({}, this.searchForm);
            this.listLoading = true;
			// 请求后台
			this.$http.post(urlQueryAllList, para, res => {
				if(res.data && 'A_SYS_00010' === res.data.code){
						this.coachList = res.data.data.rows;
						this.total = res.data.data.total;
						this.page = res.data.data.page;
				}else{
						this.coachList = [];
						this.total = 0;
						this.page = 1;
				}
				
				this.listLoading = false;
			});

        },
       
        resetSearchFrom:function(formName){
            this.$refs[formName].resetFields();
        },
        //2 新增
        //2.1 新增窗口
        handleAdd:function(){
            this.addFormVisible = true;
            this.changeInitData(this.formTypeObj.add);
            this.addForm = {
                name:'',
                birth: '',
                age:'',
                sex:-1,
                jobState:'',
                gymId:'',
                userAccount:'',
                userPasswd:'',
                courseIdArr:[]
            },
            this.coachCourseArr = []
        },
        //2.2 新增提交
        formSubmit:function(){
            var formSubmitUrl = '';
            var confirmTxt = '确认提交么?'
            if(this.formType === this.formTypeObj.add){
                formSubmitUrl = urlAddCoach;
            }
            if(this.formType === this.formTypeObj.edit){
                confirmTxt = "确认修改么？"
                formSubmitUrl = urlUpdateCoach;
            }
            this.$refs[this.formNameObj.addForm].validate((valid) => {
				if(valid){
						this.$confirm(confirmTxt,'提示',{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'info '
						}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							this.$http.post(formSubmitUrl, para, res => {
								this.addLoading = false;
								if(res && res.data && 'A_SYS_00010' === res.data.code){
								    this.$message({
										message: res.data.msg,
										type: 'success'
									});
									this.$refs[this.formTypeObj.addForm].resetFields();
									this.addFormVisible = false;
									this.getCoachList();
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
        },
        getCoachCourseList:function(coachId){
            if(!coachId){
                return;
            }
            
            let para = {coachId:coachId}
            this.$http.get(urlQueryCourseByCoachId, para, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                        
                        this.addForm.courseIdArr = []
                        res.data.data.forEach(item => {
                            this.addForm.courseIdArr.push(item.courseNo)
                        });

                        this.coachCourseArr = this.addForm.courseIdArr
                        
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                    }

            });
        },
        getCoachDetailById:function(coachId){
            if(!coachId){
                return this.coach;
            }
            
            let para = {coachId:coachId}
            this.$http.get(urlQueryDetailById, para, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                       
                       this.coach =  Object.assign({},res.data.data)
                       this.addForm = Object.assign({},res.data.data)
                        this.getCoachCourseList(coachId);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                    }

            });
            
        },
        changeInitData:function(formTppe){
			if(this.formTypeObj.add=== formTppe ){
				this.formTitle = "新增";
				this.formType = this.formTypeObj.add;
				this.showSubmit = true;
			}
			if(this.formTypeObj.edit=== formTppe ){
				this.formTitle = "编辑";
				this.formType = this.formTypeObj.edit;
				this.showSubmit = true;
			}

			if(this.formTypeObj.view === formTppe ){
				this.formTitle = "查看详情";
				this.formType = this.formTypeObj.edit;
				this.showSubmit = false;
			}
		},
        //3 编辑
        //3.1 编辑窗口
        handleEdit: function(index,row){
            this.addLoading = true;
            this.getCoachDetailById(row.id);
           
            this.changeInitData(this.formTypeObj.edit);
            this.addFormVisible = true;
        },
        
        //3.2 编辑提交
        //4 查询详情
        handleDetail: function(index,row){
            this.detailLoading = true;
            this.getCoachDetailById(row.id);
           
            this.detailVisible = true;
        },
       
        initGymList: function(){
            this.$http.post(urlGetGymList, {}, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                       this.gymList = res.data.data;
                    }else{
                        this.gymList = [];
                    }

            });
        },
        initCourseList: function(){
            this.$http.post(urlGetCourseList, {}, res => {
                    this.addLoading = false;
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
			this.getCoachList();
	    }
    },
    mounted() {
      this.getCoachList();
      this.initGymList();
      this.initCourseList();
    },
	components:{
		'pagination':Pageination
	}
}
</script>

