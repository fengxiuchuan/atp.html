<template>
    <section>
        <!--课程列表-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="searchForm" ref="searchForm" :inline="true">
                <el-input :model="searchForm.page" type="hidden" ></el-input>
                <el-input :model="searchForm.pageSize" type="hidden"></el-input>
               
                <el-form-item prop="courseName">
                    <el-input v-model="searchForm.courseName"  placeholder="课程名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" v-on:click="getCourseList">查询</el-button>
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
        <el-table :data="courseList" highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
        
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column prop="courseName" label="课程名称" sortable>
            </el-table-column>
            <el-table-column prop="remark" label="备注" >
            </el-table-column>
            <el-table-column prop="createdName" label="创建人">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
		

		<!--工具条-->
		<pagination @search="pageSearch" :total="total" :currentPage ="page"></pagination>
        <!--新增、编辑课程-->
        <el-dialog :title="formTitle"  :visible.sync="addFormVisible" :close-on-click-modal="true">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
				<el-input type="hidden" v-model="addForm.id"></el-input>
				<el-form-item label="课程名称" prop="courseName">
                    <el-input type="text" v-model="addForm.courseName"></el-input>
                </el-form-item>
            
                <el-form-item label="备注">
                   <el-input type="textarea" v-model="addForm.remark"></el-input>
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
import 
{ 
 urlAddCourse, urlQueryAllList, urlUpdateCourse, urlGetCourseList
 } from "../api/req_course";


import util from '../common/js/util'
import formUtil from '../common/js/formUitl'
import Pageination from '../components/pagination'
export default {
    data:function(){
        return {
            searchForm:{
                courseName:'',
                page:1,
                pageSize:20
            },
            total:0,
            page:1,
            pageSize:20,
            listLoading:false,
            courseList:[],
            formTitle:"新增",
            addFormVisible:false,
            addLoading:false,
            addFormRules:{
                courseName:[
                    { required: true, message: '请输入课程名称', trigger: 'blur' }
                ]
            },
            addForm:{
                courseName:"",
                remark:""
            },
            initAddForm:{
                courseName:"",
                remark:""
            },
            formTypeObj:{
                add:'add',
                edit:'edit'
            },
            formNameObj:{
                searchForm:"searchForm",
                addForm:"addForm"
            },
            formType:''
        }
    },
    methods:{
        //1 初始化列表
        getCourseList:function(){
            this.searchForm.page = this.page;
            this.searchForm.pageSize = this.pageSize;
            let para = Object.assign({}, this.searchForm);
            this.listLoading = true;
			// 请求后台
			this.$http.post(urlQueryAllList, para, res => {
				if(res.data && 'A_SYS_00010' === res.data.code){
						this.courseList = res.data.data.rows;
						this.total = res.data.data.total;
				}else{
						this.courseList = [];
						this.total = 0;
						this.page = 1;
				}
				this.listLoading = false;
			});
        },
        //2 新增方法
        handleAdd:function(){
            this.formUtil = "新增课程";
            this.formType = this.formTypeObj.add;
            this.addForm= this.initAddForm;
            this.addFormVisible = true;
        },
        //3 提交方法
        formSubmit:function(){
            var formSubmitUrl = '';
            var confirmTxt = '确认提交么?'
            if(this.formType === this.formTypeObj.add){
                formSubmitUrl = urlAddCourse;
            }
            if(this.formType === this.formTypeObj.edit){
                confirmTxt = "确认修改么？"
                formSubmitUrl = urlUpdateCourse;
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
									this.$refs[this.formTypeObj.addForm].resetFields();
									this.addFormVisible = false;
									this.getCourseList();
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
        //4 编辑方法
        handleEdit:function(index,row){
            this.formTitle = '编辑课程';
            this.formType = this.formTypeObj.edit
            this.addForm = Object.assign({},row)
            this.addFormVisible = true;
        },
        //搜索
        pageSearch:function(pageination){
            this.page = pageination.page;
            this.pageSize = pageination.pageSize;
            this.total = pageination.total;
            this.getCourseList();
        },
        //重置
        resetSearchFrom:function(formName){
            this.$refs[formName].resetFields();
        },
    },
    mounted() {
        this.getCourseList();
    },
	components:{
		'pagination':Pageination
	}
}
</script>
