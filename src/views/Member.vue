<template>
	<section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :model="searchForm" ref="searchForm" :inline="true">
					<el-input :model="searchForm.page" type="hidden"  ></el-input>
					<el-input :model="searchForm.pageSize" type="hidden"></el-input>
					<el-form-item prop="name">
						<el-input v-model="searchForm.name"  placeholder="姓名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" v-on:click="getUsers">查询</el-button>
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
			<el-table :data="members" highlight-current-row v-loading="listLoading" style="width: 100%;"  size="small">
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
				<el-table-column label="操作" >
					<template scope="scope">
						<!-- <el-button size="small" @click="reCharge(scope.$index, scope.row)">充值</el-button>
						<el-button size="small" @click="consume(scope.$index, scope.row)">销课</el-button> -->
						<el-button size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		

		<!--工具条-->
		<pagination @search="pageSearch" :total="total" :currentPage = "page"></pagination>

		<!--新增界面-->
		<el-dialog :title="formTitle"  :visible.sync="addFormVisible" :close-on-click-modal="true">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
				<el-input type="hidden" v-model="addForm.id"></el-input>
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名" prop="name">
							<el-input :readonly="readOnly" v-model="addForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="出生日期">
							<el-date-picker :readonly="readOnly"   type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
						</el-form-item>
					</el-col>
					
				</el-row>
				<el-row>
					<el-col :span="12">
							<el-form-item label="年龄">
								<el-input-number :readonly="readOnly"  v-model="addForm.age" :min="0" :max="200"></el-input-number>
							</el-form-item>
					</el-col>
					
					<el-col :span="12">
						<el-form-item label="性别" prop="sex">
							<el-radio-group  :readonly="readOnly"  v-model="addForm.sex">
								<el-radio class="radio" :label="1">男</el-radio>
								<el-radio class="radio" :label="0">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="身份证号码" prop="idCard">
							<el-input  :readonly="readOnly" v-model="addForm.idCard" placeholder="请填写身份证号码"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
							<el-form-item label="联系方式" prop="phone">
								<el-input  :readonly="readOnly"  v-model="addForm.phone" placeholder="请填写联系方式"></el-input>
							</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="会员卡号" prop="cardNo"> 
							<el-input  :readonly="readOnly"  v-model="addForm.cardNo" placeholder="会员卡号"></el-input>
						</el-form-item>
					</el-col>
					
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="会员密码" prop="cardPwd">
							<el-input  :readonly="readOnly"  type="password" v-model="addForm.cardPwd" placeholder="请填写密码"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="重复密码" prop="repeatPwd">
							<el-input :readonly="readOnly"  type="password" v-model="addForm.repeatPwd" placeholder="重复密码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="联系地址">
							<el-input  :readonly="readOnly" type="textarea" v-model="addForm.address" placeholder="联系地址"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input  :readonly="readOnly"  type="textarea" v-model="addForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">{{ cancelLabel }}</el-button>
				<el-button v-if="showSubmit" type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		
		<!--详情页面-->
		<el-dialog title="会员详情"  :visible.sync="detailVisible" :close-on-click-modal="true" :loading="detailLoading">
			<el-form  label-width="100px" label-suffix="：" >
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名"  >
							<span v-text="member.name" ></span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="出生日期">
							<span v-text="member.birth"></span>
						</el-form-item>
					</el-col>
					
				</el-row>
				<el-row>
					<el-col :span="12">
							<el-form-item label="年龄">
								<span v-text="member.age"></span>
							</el-form-item>
					</el-col>
					
					<el-col :span="12">
						<el-form-item label="性别" >
							<span v-text=" member.sex | parseSex"></span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="身份证号码">
							<span v-text="member.idCard"></span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
							<el-form-item label="联系方式" >
								<span v-text="member.phone"></span>
							</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="会员卡号" > 
							<span v-text="member.cardNo"></span>
						</el-form-item>
					</el-col>
					
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="联系地址">
							<span v-text="member.address"></span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="备注">
							<span v-text="member.remark"></span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<hr>
			<el-row>
				<el-col :span="24">
					<el-tag>报名课程</el-tag>
				</el-col>
				<el-col :span="24">
					<el-table
						:data="courseList"
						style="width: 100%">
						<el-table-column
							prop="orderNo"
							label="订单编号"
							>
						</el-table-column>
						<el-table-column
							prop="courseAmount"
							label="金额"
							>
						</el-table-column>
						<el-table-column
							prop="courseName"
							label="课程名称"
							>
						</el-table-column>
						<el-table-column
							prop="coachName"
							label="课程教练">
						</el-table-column>
						<el-table-column
							prop="totalNum"
							label="总课时">
						</el-table-column>
						<el-table-column
							prop="freeNum"
							label="剩余课时">
						</el-table-column>
						<el-table-column
							prop="usedNum"
							label="消耗课时">
						</el-table-column>
					</el-table>
					</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>

import 
{ 
 urlMemberList,
 urlAddMember, 
 urlUpdateMember, 
 urlGetMemById, 
 urlGetCourseListByMemId
 } from "../api/req_member";
import util from '../common/js/util'
import Pageination from '../components/pagination'
//import NProgress from 'nprogress'
 
export default {
  data() {
    return {
		searchForm: {
			name: "",
			page:1,
			pageSize:20
		},
		total:0,
		page:1,
		pageSize:20,
		members: [],
		formTypeObj:{
			add :'add',
			edit:'edit',
			view:'view'
		},
		showSubmit:true,
		formTitle:"新增",
		readOnly:false,
		cancelLabel:'取消',
		formType:'add',
      	listLoading: false,
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
				{required:	true,	message:"请选择性别",trigger: 'change'}
			],
			phone:[
				{required: true, message: '请输入手机号', trigger: 'blur'}
			],
			idCard:[
				{required: true, message: '请输入身份证号码', trigger: 'blur'}
			],
			cardNo:[
				{required: true, message: '请输入会员卡号', trigger: 'blur'}
			],
			cardPwd:[
				{required: true, message: '请输入密码', trigger: 'blur'}
			],
			repeatPwd:[
				{required: true, message: '请重复密码', trigger: 'blur'}
			]
		
			
		},
		detailVisible:false,
		detailLoading: false,
		// 单个会员详情
		member:{
			name:'',
			sex: -1,
			age: 0,
			birth: '',
			phone:'',
			idCard:'',
			cardNo:'',
			address: '',
			remark:'',
		},
		courseList:[]
    };
  },
  filters:{
	  parseSex:function(sex){
		 if(0 === sex){
			 return "女"
		 }
		 if(1 === sex){
			 return "男"
		 }
	  }
  },
  methods: {
	   parseSex:function(sex){
		 if(0 === sex){
			 return "女"
		 }
		 if(1 === sex){
			 return "男"
		 }
	  },
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
	},
	handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
	},
	resetSearchFrom:function(formName){
		this.$refs['searchForm'].resetFields();
	},
    //获取用户列表
    getUsers: function() {
	  this.searchForm.page = this.page;
	  this.searchForm.pageSize = this.pageSize;
	  let para = Object.assign({}, this.searchForm);
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
		
		// 新增按钮
		handleAdd:function(){
			this.addFormVisible = true;
			this.changeInitData(this.formTypeObj.add);
			this.addForm = {
				name:'',
				sex: -1,
				age: 0,
				birth: '',
				address: '',
				phone:''
			}
		},
		changeInitData:function(formTppe){
			if(this.formTypeObj.add=== formTppe ){
				this.formTitle = "新增";
				this.formType = this.formTypeObj.add;
				this.readOnly = false;
				this.showSubmit = true;
			}
			if(this.formTypeObj.edit=== formTppe ){
				this.formTitle = "编辑";
				this.formType = this.formTypeObj.edit;
				this.readOnly = false;
				this.showSubmit = true;
			}

			if(this.formTypeObj.view === formTppe ){
				this.formTitle = "查看详情";
				this.formType = this.formTypeObj.detail;
				this.readOnly = false;
				this.cancelLabel = '取消';
				this.showSubmit = false;
			}
		},
		// 编辑按钮
		//显示编辑界面
		handleEdit: function (index, row) {
			this.addFormVisible = true;
			this.changeInitData(this.formTypeObj.edit);
			//查询
			this.addForm = Object.assign({}, row);
			
		},
		// 会员详情
		handleDetail: function(index, row) {
			this.detailLoading = true;
			let id = row.id;
			this.getMemById(id);
			this.getCourseListByMemId(id);
			this.detailLoading = false;
			this.detailVisible = true;
		},
		getCourseListByMemId: function(memberId){
			if(!memberId){
				return;
			}
			let para = {memberId: memberId}
			this.$http.get(urlGetCourseListByMemId, para, res => {
				this.addLoading = false;
				if(res && res.data && res.data.code === 'A_SYS_00010'){
					this.courseList = res.data.data;
				}else{
					this.$message({
						message: res.data.msg,
						type: 'warning'
					});
				}

			});
		},
		getMemById: function(memberId){
			if(!memberId){
				return;
			}
			let para = {memberId: memberId}
			this.$http.get(urlGetMemById, para, res => {
				this.addLoading = false;
				if(res && res.data && res.data.code === 'A_SYS_00010'){
					this.member = Object.assign({},res.data.data);
				}else{
					this.$message({
						message: res.data.msg,
						type: 'warning'
					});
				}

			});
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
							let submitURL = urlAddMember;
							if(formTypeObj.edit=== this.formType){
								submitURL = urlUpdateMember;
							}
							
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							this.$http.post(submitURL, para, res => {
								this.addLoading = false;
								if(res && res.data && res.data.code === 'A_SYS_00010'){
								
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getUsers();
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
	pageSearch:function(pageination){
			this.page = pageination.page;
			this.pageSize = pageination.pageSize;
			this.total = pageination.total;
			this.getUsers()
	},
		
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