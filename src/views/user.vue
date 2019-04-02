<template>
    <section>
        <!--用户列表-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="searchForm" ref="searchForm" :inline="true">
                <el-input :model="searchForm.page" type="hidden" ></el-input>
                <el-input :model="searchForm.pageSize" type="hidden"></el-input>
                <el-form-item>
                    <el-input v-model="searchForm.displayName"  placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.userName"  placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.phone"  placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" v-on:click="getUserList">查询</el-button>
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
        <el-table :data="userList" highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column prop="displayName" label="用户名"  sortable>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" sortable>
            </el-table-column>
            <el-table-column prop="userName" label="用户名"  sortable>
            </el-table-column>
            <el-table-column prop="enable" label="是否有效" >
                 <template scope="scope">
                        <el-switch disabled
                            active-text ="是"
                            inactive-text = "否"
                            on-color="#5B7BFA"
                            off-color="#dadde5"
                            active-value="1"
                            inactive-value="0"
                            v-model="scope.row.enable"      
                        >
                        </el-switch>
                    </template>
            </el-table-column>
            <el-table-column prop="remark"  label="备注">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                     <el-button size="small" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
                     <el-button size="small" icon="el-icon-edit-outline" @click="grantRole(scope.$index, scope.row)">授权</el-button>
                </template>
            </el-table-column>
        </el-table>
		

		<!--工具条-->
		<pagination @search="pageSearch" :total="total" :currentPage = "page"></pagination>


        <el-dialog title="角色分配"  :visible.sync="userRoleFormVisible" :close-on-click-modal="true">
            <el-form :model="userRoleForm" label-width="120px"  ref="userRoleForm" >
                <el-input type="hidden" v-model="userRoleForm.id"></el-input>
                 <el-form-item label="姓名" prop="displayName">
                    <el-input  v-model="userRoleForm.displayName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="角色列表" prop="userRoleArr">
                    <el-transfer
                        v-model="userRoleForm.userRoleArr"
                         :titles="['待选角色', '已选角色']"
                        :data="roleList">
                    </el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
				<el-button @click.native="userRoleFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="grantRoleSubmit" :loading="grantLoading">提交</el-button>
			</div>
        </el-dialog>

        <!--新增/编辑界面-->
		<el-dialog :title="formTitle"  :visible.sync="addFormVisible" :close-on-click-modal="true">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" >
				<el-input type="hidden" v-model="addForm.id"></el-input>
    
                <el-form-item label="姓名" prop="displayName">
                    <el-input  v-model="addForm.displayName" auto-complete="off" placeholder="请填写用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input  v-model="addForm.phone" auto-complete="off" placeholder="请填写联系方式"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input  v-model="addForm.userName" auto-complete="off" placeholder="请填写用户名"></el-input>
                </el-form-item>
                <el-form-item v-if="formType == formObj.add.formType" label="密码" prop="userPwd">
                    <el-input  type="password"  v-model="addForm.userPwd" auto-complete="off"  placeholder="请填写用户密码"></el-input>
                </el-form-item>
                <el-form-item v-if="formType == formObj.add.formType" label="重复密码" >
                    <el-input type="password"  v-model="addForm.confirmPwd" :min="0" :max="11"  placeholder="重复密码"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="enabled">
                     <el-radio-group    v-model="addForm.enabled">
                        <el-radio-button label="1">有效</el-radio-button>
                        <el-radio-button label="0">无效</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form> 
            
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="formSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        
    </section>
</template>
<script>

import  {urlAddUser,urlEditUser,urlQueryAllList,urlDelUser,urlUpdateUser,urlGrantRole} from '../api/req_user.js'
import {urlGetRoleList} from '../api/req_role.js'
import util from '../common/js/util'
import Pageination from '../components/pagination'
import axios from 'axios'
export default {
    data:function(){
        var validatePass = (rule, value, callback) => {
		    console.log(this.addForm.userPwd)
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.addForm.userPwd) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
        };
        return {
            userRoleForm:{
                userRoleArr:[],
                id:-1,
                displayName:''
            },
            userRoleFormVisible:false,
            roleList:[],
            searchForm:{
                displayName:'',
                userName:'',
                phone:'',
                page:1,
                pageSize:20
            },
            addForm:{
                id:-1,
                displayName:"",
                phone:"",
                userName:"",
                userPwd:"",
                confirmPwd:"",
                enabled:-1
            },
            userList:[],
            formType:'',
            formNameObj:{
                searchForm:"searchForm",
                addForm:"addForm",
                userRoleForm:"userRoleForm"
            },
            userPwdRule:[
                { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            confirmPwdRule:[
                { required: true, validator: validatePass, trigger: 'blur' }
            ],
            addFormRules:{
                displayName:[
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone:[
                    { required: true, message: '请输入联系方式', trigger: 'blur' }
                ],
                userName:[
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                
                enabled:[
                  { required: true, message: '请填写状态', trigger: 'blur' }
                ]
            },
            initAddForm:{
                id:-1,
                displayName:"",
                phone:"",
                userName:"",
                userPwd:"",
                confirmPwd:"",
                enabled:-1
            },
            formObj:{
                add:{
                    formType:'add',
                    title:'新增用户'
                },
                edit:{
                    formType:'edit',
                    title:'编辑用户'
                }
            },
			total:0,
            page:1,
            pageSize:20,
            listLoading:false,
            formTitle:"新增",
            addFormVisible:false,
            addLoading:false,
            grantLoading:false,
			viewOnly:false
        }
    },
    methods:{
        getUserList:function(){
            this.searchForm.page = this.page;
            this.searchForm.pageSize = this.pageSize;
            let para = Object.assign({}, this.searchForm);
            this.listLoading = true;
			// 请求后台
			this.$http.post(urlQueryAllList, para, res => {
				if(res.data && 'A_SYS_00010' === res.data.code){
						this.userList = res.data.data.rows;
						this.total = res.data.data.total;
						this.page = res.data.data.page;
				}else{
						this.userList = [];
						this.total = 0;
						this.page = 1;
				}
				this.listLoading = false;
			});
        },
        resetSearchFrom:function(formName){
            this.$refs[formName].resetFields();
        },
        handleAdd:function(){
            this.formType = this.formObj.add.formType;
            this.formTitle =this.formObj.add.formTitle;
            this.addFormVisible = true;
            this.addForm = this.initAddForm;
            this.addFormRules.userPwd = this.userPwdRule;
            this.addFormRules.confirmPwd = this.confirmPwdRule
        },
        handleEdit:function(index,row){
            this.formType = this.formObj.edit.formType;
            this.formTitle =this.formObj.edit.formTitle;
            this.addFormVisible = true;
            this.addForm = Object.assign({},row)
            this.addFormRules.userPwd = '';
            this.addFormRules.confirmPwd = '';
           
        },
        grantRole:function(index,row){
            this.userRoleFormVisible = true;
           
            this.userRoleForm = Object.assign({},row)
            this.userRoleForm.menuList = null
            if(this.userRoleForm.userRoleArr == null){
                this.userRoleForm.userRoleArr = []
            }
        },
        grantRoleSubmit:function(){
            let curUserRoleArr = this.userRoleForm.userRoleArr;
            let userRoleList = []; 
            this.userRoleForm.userRoleList = []
            
            if(curUserRoleArr != null || curUserRoleArr.length > 0){
                this.userRoleForm.roleCodes = curUserRoleArr.join(",")
            }

           axios.post("http://localhost:7005/sysUser/grantRole.do",this.userRoleForm,{
                   headers: {
                    'Content-Type':'application/json;charset=UTF-8'
                        }
               }).then((res) =>{
                     this.grantLoading = true;
                    if(res && res.data && 'A_SYS_00010' === res.data.code){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.$refs[this.formNameObj.userRoleForm].resetFields();
                        this.grantLoading = false;
                        this.getUserList();
                        this.userRoleFormVisible = false;
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                    }
               }).catch((res) =>{
                  
                    this.$message({
                        message: "提交失败",
                        type: 'warning'
                    });
               });
           
        },
        pageSearch:function(){
            this.page = pageination.page;
            this.pageSize = pageination.pageSize;
            this.total = pageination.total;
            this.getUserList();
        },
        formSubmit:function(){
            var formSubmitUrl = '';
            var confirmTxt = '确认提交么?'
            if(this.formType === this.formObj.add.formType){
                formSubmitUrl = urlAddUser;
            }
            if(this.formType === this.formObj.edit.formType){
                confirmTxt = "确认修改么？"
                formSubmitUrl = urlEditUser;
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
									this.getUserList();
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
        getRoleList:function(){
            // 请求后台
			this.$http.post(urlGetRoleList, {}, res => {
				if(res.data && 'A_SYS_00010' === res.data.code){
					this.roleList = res.data.data;
				}else{
					this.roleList = []
				}
				
			});
        }
    },
    mounted(){
        this.getUserList();
        this.getRoleList();
    },
     components:{
        'pagination':Pageination
    }
}
</script>

