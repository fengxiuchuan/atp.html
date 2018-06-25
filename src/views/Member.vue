<template>
	<section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="getUsers">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="members" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column prop="age" label="年龄" width="100" sortable>
				</el-table-column>
				<el-table-column prop="phone" label="手机号码" width="120" sortable>
				</el-table-column>
				<el-table-column prop="address" label="地址" min-width="180" sortable>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		

			<!--工具条-->
			<!-- <el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
				</el-pagination>
			</el-col> -->

		<pagination @search="pageSearch" :total="total" :currentPage = "page"></pagination>

		<!--新增界面-->
		<el-dialog title="新增"  :visible.sync="addFormVisible" :close-on-click-modal="true">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑"  :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>
<script>
import 'element-ui/lib/theme-chalk/index.css'
import { urlMemberList, urlAddMember, urlUpdateMember } from "../api/req_member";
import util from '../common/js/util'
import Pageination from '../components/pagination'
//import NProgress from 'nprogress'
 
export default {
  data() {
    return {
      filters: {
        name: ""
      },
      listLoading: false,
			members: [],
			total:0,
			page:1,
			pageSize:20,
			addFormVisible:false,
			addLoading:false,
			addForm:{
				name:'',
				sex: -1,
				age: 0,
				birth: '',
				address: '',
				phone:''
			},
			addFormRules:{
				name:[
					{ required: true, message: '请输入姓名', trigger: 'blur' },
					{ min: 2, message: '长度在 2 个字符以上', trigger: 'blur' }
				],
				sex:[
					{required:	true,	message:	"请选择性别",trigger: 'change'}
				],
			
				
			},
			editFormVisible:false,
			editLoading:false,
			editForm:{
				id:0,
				name:'',
				sex: -1,
				age: 0,
				birth: '',
				address: '',
				phone:''
			},
			editFormRules:{
				name:[
					{ required: true, message: '请输入姓名', trigger: 'blur' },
					{ min: 2, message: '长度在 2 个字符以上', trigger: 'blur' }
				],
				sex:[
					{required:	true,	message:	"请选择性别",trigger: 'change'}
				],
				
			}
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
		},
		handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
		},
    //获取用户列表
    getUsers: function() {
      let para = {
				name: this.filters.name,
				page:this.page,
				pageSize:this.pageSize
      };
      this.listLoading = true;
			// 请求后台
			this.$http.post(urlMemberList, para, res => {
				if(res.data.code =='A_SYS_00010'){
						this.members = res.data.data.rows;
						this.total = res.data.data.total;
						this.page = res.data.data.page;
				}else{
						this.members = [];
						this.total = 0;
						this.page = 1;
				}
				
				this.listLoading = false;
			});
		},
		//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					
				}).catch(() => {

				});
			},
		// 新增按钮
		handleAdd:function(){
			this.addFormVisible = true;
			this.addForm = {
				name:'',
				sex: -1,
				age: 0,
				birth: '',
				address: '',
				phone:''
			}
		},
		// 编辑按钮
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
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
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							this.$http.post(urlAddMember, para, res => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						})
				}
			})
		},
		pageSearch:function(pageination){
				this.page = pageination.page;
				this.pageSize = pageination.pageSize;
				this.total = pageination.total;
				this.getUsers()
		},
		editSubmit:function(){
			this.$refs['editForm'].validate((valid) => {
				if(valid){
						this.$confirm("确认修改么？",'提示',{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'info '
						}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							this.$http.post(urlUpdateMember, para, res => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						})
				}
			})
		}
  },
  mounted() {
    this.getUsers();
	},
	components:{
		'pagination':Pageination
	}
};
</script>

<style>
</style>