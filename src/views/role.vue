<template>
    <section>
        <!--角色列表-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="searchForm" ref="searchForm" :inline="true">
                <el-input :model="searchForm.page" type="hidden" ></el-input>
                <el-input :model="searchForm.pageSize" type="hidden"></el-input>
                <el-form-item>
                    <el-input v-model="searchForm.roleCode"  placeholder="角色编码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.roleName"  placeholder="角色名称"></el-input>
                </el-form-item>
                 <el-form-item>
                    <el-button icon="el-icon-search" type="primary" v-on:click="getRoleList">查询</el-button>
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
        <el-table :data="roleList" highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称"  sortable>
            </el-table-column>
            <el-table-column prop="roleCode" label="角色编码" sortable>
            </el-table-column>
            <el-table-column prop="roleDesc" label="描述"  sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
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
    
                <el-form-item label="角色编码" prop="roleCode">
                    <el-input  v-model="addForm.roleCode" auto-complete="off" placeholder="请填写角色编码"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input  v-model="addForm.roleName" auto-complete="off" placeholder="请填写角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input  v-model="addForm.roleDesc" auto-complete="off" placeholder="请填写角色名称"></el-input>
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

import   {urlAddRole,urlEditRole,urlQueryAllList,urlDelRole} from '../api/req_role.js'
import util from '../common/js/util'
import Pageination from '../components/pagination'
export default {
    data:function(){
        
        return {
            searchForm:{
                roleCode:'',
                roleName:'',
                page:1,
                pageSize:20
            },
            roleList:[],
            formType:'',
            formNameObj:{
                searchForm:"searchForm",
                addForm:"addForm"
            },
            addFormRules:{
                roleCode:[
                    { required: true, message: '请输入角色编码', trigger: 'blur' }
                ],
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                
            },
            initAddForm:{
                roleCode:"",
                roleName:"",
                roleDesc:""
            },
            formObj:{
                add:{
                    formType:'add',
                    title:'新增角色'
                },
                edit:{
                    formType:'edit',
                    title:'编辑角色'
                }
            },
			total:0,
            page:1,
            pageSize:20,
            listLoading:false,
            formTitle:"新增",
            addFormVisible:false,
            addLoading:false,
        }
    },
    methods:{
        getRoleList:function(){
            this.searchForm.page = this.page;
            this.searchForm.pageSize = this.pageSize;
            let para = Object.assign({}, this.searchForm);
            this.listLoading = true;
			// 请求后台
			this.$http.post(urlQueryAllList, para, res => {
				if(res.data && 'A_SYS_00010' === res.data.code){
						this.roleList = res.data.data.rows;
						this.total = res.data.data.total;
						this.page = res.data.data.page;
				}else{
						this.roleList = [];
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
        },
        handleEdit:function(index,row){
            this.formType = this.formObj.edit.formType;
            this.formTitle =this.formObj.edit.formTitle;
            this.addFormVisible = true;
            this.addForm = Object.assign({},row)
        },
        pageSearch:function(){
            this.page = pageination.page;
            this.pageSize = pageination.pageSize;
            this.total = pageination.total;
            this.getRoleList();
        },
        formSubmit:function(){
            var formSubmitUrl = '';
            var confirmTxt = '确认提交么?'
            if(this.formType === this.formObj.add.formType){
                formSubmitUrl = urlAddRole;
            }
            if(this.formType === this.formObj.edit.formType){
                confirmTxt = "确认修改么？"
                formSubmitUrl = urlEditRole;
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
									this.getRoleList();
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
    },
    mounted(){
        this.getRoleList();
    },
     components:{
        'pagination':Pageination
    }
}
</script>

