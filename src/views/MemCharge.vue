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
                                placeholder="请输入待充值卡号/姓名/电话">
								<el-option
                                    v-for="item in selMemList"
                                    :key="item.id"
                                    :label="item.cardNo"
                                    :value="item.id" >
                                <div>
                                    <span style="float: left;backgroud-color:#fff">{{ item.cardNo }}</span>
                                    &nbsp;&nbsp;&nbsp;
                                    <span >{{ item.name }}</span>
                                     &nbsp;&nbsp;&nbsp;
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phone }}</span>
                                </div>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				
				</el-row>
				
				<el-row>
					<el-col :span="24">
						<el-form-item label="充值课程">
							<template scope>
								<Recharge  @addMemCourse="addMemCourse" @refreshSelectedCourses="refreshSelectedCourses" :memCourselist="selectedCourseList" ></Recharge>
							</template>
						</el-form-item>
					</el-col>
					
				</el-row>
                <el-row>
                    <el-button plain>取消</el-button>
				    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </el-row>
			</el-form>
			
    </section>
</template>
<script>
import 
{ urlGetMemberList,urlPayCourse} from "../api/req_member";
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
            addFormRules:{
                memId:[
                    { required: true, message: '请选择充值人', trigger: 'blur' },
                ]
            },
            addForm:{
               
            }
        }
    },
    methods:{
        addMemCourse:function(){
            this.selectedCourseList.push({courseList:this.courseList,coachList:[],courseAmountArr:'',actualAmount:''})
        },
        refreshSelectedCourses:function(selectedCourseList){
            if(!selectedCourseList){
                return;
            }
            this.addForm.courseIdArr=[]
            this.addForm.coachIdArr=[]
            this.addForm.totalNumArr=[]
            this.addForm.courseAmountArr=[]
            this.addForm.unitPriceArr = []
            this.addForm.discountAmountArr = []
            selectedCourseList.forEach(item => {
                this.addForm.courseIdArr.push(item.courseIdArr)
                this.addForm.coachIdArr.push(item.coachIdArr)
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
        initGymCourseList:function(){
            this.$http.post(urlGetGymCourseList, {}, res => {
			if(res && res.data && 'A_SYS_00010' === res.data.code){
				this.courseList = res.data.data;
			}else{
				this.courseList = [];
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
        this.initMemberList();
        this.initGymCourseList();
    },
    components:{
		'Recharge':Recharge
     }
}
</script>

