<template>
    <section>
        <!--健身馆列表-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="searchForm" ref="searchForm" :inline="true">
                <el-input :model="searchForm.page" type="hidden" ></el-input>
                <el-input :model="searchForm.pageSize" type="hidden"></el-input>
                <el-form-item prop="gymName">
                    <el-input v-model="searchForm.gymName"  placeholder="场馆名"></el-input>
                </el-form-item>
                <el-form-item prop="manager">
                    <el-input v-model="searchForm.manager"  placeholder="负责人姓名"></el-input>
                </el-form-item>
                 <el-form-item prop="phone">
                    <el-input v-model="searchForm.phone"  placeholder="负责人联系方式"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" v-on:click="getGymList">查询</el-button>
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
        <el-table :data="gymList" highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column prop="gymName" label="场馆名称"  sortable>
            </el-table-column>
            <el-table-column prop="manager" label="负责人姓名" sortable>
            </el-table-column>
            <el-table-column prop="phone" label="负责人联系方式" >
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" icon="el-icon-edit-outline" @click="handleView(scope.$index, scope.row)"></el-button>
                    <el-button size="small" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
		

		<!--工具条-->
		<pagination @search="pageSearch" :total="total" :currentPage = "page"></pagination>

        <!--新增/编辑界面-->
		<el-dialog :title="formTitle"  :visible.sync="addFormVisible" :close-on-click-modal="true">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" >
				<el-input type="hidden" v-model="addForm.id"></el-input>
			
                <el-form-item label="场馆名称" prop="gymName">
                    <el-input v-if="formType != formObj.view.formType" v-model="addForm.gymName" auto-complete="off" placeholder="请填写场馆名称"></el-input>
                    <span  v-if="formType == formObj.view.formType" v-text="addForm.gymName"></span>
                </el-form-item>
        
                <el-form-item label="负责人姓名" prop="manager">
                    <el-input  v-if="formType != formObj.view.formType" type="text"  v-model="addForm.manager" auto-complete="off"  placeholder="请填写负责人姓名"></el-input>
                    <span  v-if="formType == formObj.view.formType" v-text="addForm.manager"></span>
                </el-form-item>
                <el-form-item label="负责人联系方式" prop="phone">
                    <el-input  v-if="formType != formObj.view.formType"  v-model="addForm.phone" :min="0" :max="11"  placeholder="请填写负责人联系方式"></el-input>
                    <span  v-if="formType == formObj.view.formType" v-text="addForm.phone"></span>
                </el-form-item>
        
                <el-form-item label="地址" prop="address">
                    <el-input  v-if="formType != formObj.view.formType" type="text" placeholder="请填写地址" v-model="addForm.address"></el-input>
                    <span  v-if="formType == formObj.view.formType" v-text="addForm.address"></span>
                </el-form-item>
                
                <el-form-item label="课程" prop="courseIdArr">
                    <el-select v-model="addForm.courseIdArr" :disabled="viewOnly" multiple filterable placeholder="请选择">
                        <el-option
                        v-for="item in courseList"
                        :key="item.id"
                        :label="item.courseName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
               
            </el-form> 
            <el-row v-if="viewOnly">
				<el-col :span="24">
					<el-tag>场馆教练</el-tag>
				</el-col>
				<el-col :span="24">
					<el-table
						:data="gymCoachList"
						style="width: 100%">
						<el-table-column
							prop="coachName"
							label="教练名称"
							>
						</el-table-column>
						<el-table-column
							prop="sex"
							label="性别"
							>
						</el-table-column>
					</el-table>
					</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button v-if="formType != formObj.view.formType" type="primary" @click.native="formSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        
    </section>
</template>
<script>
import 
{
urlAddGym, urlQueryAllGymList, urlQUeryCoachListByGymId, urlQueryCourseListByGymId, urlQueryDetailById, urlUpdateGym, urlGetGymList
 } from "../api/req_gym";
import {urlGetCourseList}  from "../api/req_course";
import {urlGetCoachList} from '../api/req_coach'
import util from '../common/js/util'
import Pageination from '../components/pagination'
export default {
    data:function(){
        return {
            searchForm:{
                gymName:'',
                manager:'',
                phone:'',
                page:1,
                pageSize:20
            },
            addForm:{
                gymName:"",
                manager:"",
                phone:"",
                address:"",
                courseIdArr:[]
            },
            initAddForm:{
                gymName:"",
                manager:"",
                phone:"",
                address:"",
                courseIdArr:[]
            },
            formObj:{
                add:{
                    formType:'add',
                    title:'新增场馆'
                },
                edit:{
                    formType:'edit',
                    title:'编辑场馆'
                },
                view:{
                    formType:'view',
                    title:'编辑场馆'
                },
            },
            formNameObj:{
                searchForm:"searchForm",
                addForm:"addForm"
            },
            addFormRules:{
                gymName:[
                    { required: true, message: '请输入课程名称', trigger: 'blur' }
                ],
                manager:[
                    { required: true, message: '请输入负责人姓名', trigger: 'blur' }
                ],
                phone:[
                    { required: true, message: '请输入联系方式', trigger: 'blur' }
                ],
                address:[
                    { required: true, message: '请输入场馆地址', trigger: 'blur' }
                ]
            },
            // 单个会员详情
            gym:{
                gymName:"",
                manager:"",
                phone:"",
                address:"",
                courseIdArr:[]
            },
            gymList:[],
            coachList:[],
            courseList:[],
            gymcourseIdArr:[],
            gymCoachList:[],
            total:0,
            page:1,
            pageSize:20,
            listLoading:false,
            formTitle:"新增",
            addFormVisible:false,
            addLoading:false,
            detailVisible:false,
		    detailLoading: false,
            formType:'',
            viewOnly:false
        }
    },
    methods:{
        getGymList:function(){
            this.searchForm.page = this.page;
            this.searchForm.pageSize = this.pageSize;
            let para = Object.assign({}, this.searchForm);
            this.listLoading = true;
			// 请求后台
			this.$http.post(urlQueryAllGymList, para, res => {
				if(res.data && 'A_SYS_00010' === res.data.code){
						this.gymList = res.data.data.rows;
						this.total = res.data.data.total;
						this.page = res.data.data.page;
				}else{
						this.gymList = [];
						this.total = 0;
						this.page = 1;
				}
				this.listLoading = false;
			});
        },
        initCourseList:function(){
            this.$http.post(urlGetCourseList, {}, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                       this.courseList = res.data.data;
                    }else{
                        this.courseList = [];
                    }

            });
        
        },
        initCoachList:function(){
            this.$http.post(urlGetCoachList, {}, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                       this.coachList = res.data.data;
                    }else{
                       this.coachList = [];
                    }

            });
        },
        getGymCoachList:function(gymId){
            let para = {gymId : gymId}
            this.$http.post(urlQUeryCoachListByGymId,para, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                       this.gymCoachList = res.data.data;
                    }else{
                       this.gymCoachList = [];
                    }

            });
        },
        getGymCourseArr:function(gymId){
            let para = {gymId : gymId}
            this.$http.post(urlQueryCourseListByGymId, para, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                        this.addForm.courseIdArr = []
                        res.data.data.forEach(item => {
                            this.addForm.courseIdArr.push(item.id)
                        });
                    }else{
                       this.addForm.courseIdArr = [];
                    }

            });
        },
        getGymDetailById:function(gymId){
             let para = {gymId : gymId}
             this.$http.post(urlQueryCourseListByGymId, para, res => {
                    this.addLoading = false;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                       this.addForm  = Object.assign({},res.data.data)
                       this.gym = Object.assign({},res.data.data)
                       this.getGymCoachList(gymId);
                       this.getGymCourseArr(gymId);
                    }else{
                       this.addForm.courseIdArr = [];
                    }

            });
        },
        resetSearchFrom:function(formName){
             this.$refs[formName].resetFields();
        },
        handleAdd:function(){
            this.changeGymConstants(this.formObj.add.formType)
            this.addFormVisible = true;
            this.addForm = this.initAddForm
            
        },
        handleEdit:function(index,row){
            this.changeGymConstants(this.formObj.edit.formType)
            this.addFormVisible = true;
            this.addForm = Object.assign({},row)
           
        },
        handleView:function(index,row){
            this.getGymDetailById(row.id);
            this.changeGymConstants(this.formObj.view.formType)
            this.addFormVisible = true;
        },
        pageSearch:function(){
            this.page = pageination.page;
            this.pageSize = pageination.pageSize;
            this.total = pageination.total;
            this.getGymList();
        },
        formSubmit:function(){
            var formSubmitUrl = '';
            var confirmTxt = '确认提交么?'
            if(this.formType === this.formObj.add.formType){
                formSubmitUrl = urlAddGym;
            }
            if(this.formType === this.formObj.edit.formType){
                confirmTxt = "确认修改么？"
                formSubmitUrl = urlUpdateGym;
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
							this.$http.post(formSubmitUrl, para, res => {
								this.addLoading = false;
								if(res && res.data && 'A_SYS_00010' === res.data.code){
								    this.$message({
										message: res.data.msg,
										type: 'success'
									});
									this.$refs[this.formNameObj.addForm].resetFields();
									this.addFormVisible = false;
									this.getGymList();
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
        changeGymConstants:function(formType){
			if(this.formObj.add.formType=== formType ){
				this.formTitle = this.formObj.add.title;
				this.formType = this.formObj.add.formType;
                this.viewOnly = false
			}
			if(this.formObj.edit.formType=== formType ){
				this.formTitle = this.formObj.edit.title;
				this.formType = this.formObj.edit.formType;
				this.viewOnly = false
			}

			if(this.formObj.viewformType === formType ){
				this.formTitle = this.formObj.view.title;
                this.formType = this.formObj.view.formType
                this.viewOnly = true
			}
		},
    },
    mounted(){
        this.getGymList();
        this.initCourseList();
        this.initCoachList();
    },
    components:{
        'pagination':Pageination
    }
}
</script>

