<template>
    <section>
        
        <!--销课列表-->
        <el-table  :data="selectedCourseList" highlight-current-row border   style="width: 100%;"  size="small">
            <el-table-column  label="课程名称" >
                <template slot-scope="scope">
                    <el-select name="courseId" v-model="selectedCourseList[scope.$index].courseId" filterable placeholder="请选择" @change="courseChange(scope.$index, scope.row)">
                        <el-option
                        v-for="item in scope.row.courseList"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value" >
                        
                            <div>
                                <span style="float: left;backgroud-color:#fff">{{ item.courseName }}</span>
                                &nbsp;&nbsp;&nbsp;
                                <span >总课时：{{ item.totalNum }}</span>
                                    &nbsp;&nbsp;&nbsp;
                                <span style="float: right; color: #8492a6; font-size: 13px">课程价格：{{ item.actualAmount }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="课程教练"  >
                <template slot-scope="scope">
                    {{ selectedCourseList[scope.$index].coachName }}
                </template>
            </el-table-column>
             <el-table-column label="剩余课时"  >
                <template slot-scope="scope">
                    {{ selectedCourseList[scope.$index].freeNum }}
                </template>
            </el-table-column>
            <el-table-column label="执行教练"  >
                <template slot-scope="scope">
                    <el-select name="execCoachId" v-model="selectedCourseList[scope.$index].execCoachId" filterable placeholder="请选择" @change="coachChange(scope.$index, scope.row)" >
                        <el-option
                        v-for="item in scope.row.coachList"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value" >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="课时费用">
                <template slot-scope="scope">
                   {{selectedCourseList[scope.$index].unitPrice}}
                </template>
            </el-table-column>
            <el-table-column label="消耗课时">
                <template slot-scope="scope">
                    <el-input name="courseNum" v-model="selectedCourseList[scope.$index].courseNum" type="text" placeholder="请输入课时数" @change="usedNumChange(scope.$index, scope.row)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="积分">
                <template slot-scope="scope">
                    <el-input name="integral" v-model="selectedCourseList[scope.$index].integral" type="text" placeholder="请输入课程费用" >
                   </el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-minus" @click="delRow(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
           
        </el-table>
         <div style="margin-top: 5px">
            <el-button size="small" icon="el-icon-plus" @click="addRow()">添加课耗课程</el-button>
        </div>
    </section>
</template>
<script>
import util from '../common/js/util'
export default {
    data:function(){
        return {
           selectedCourseList:this.memCourselist,
           courseIdArr:[]
        }
    },
    props:['memCourselist'],
    methods:{
        //删除一行
        delRow:function(index,row){
            this.selectedCourseList.splice(index,1)
        },
        courseChange:function(index,row){
            let curCourseList = row.courseList;
            let curCourseId = row.courseId;
            let curCourse = util.getItemByValue(curCourseId,curCourseList);
            this.selectedCourseList[index].memCourseId = curCourse.id;
            this.selectedCourseList[index].courseName = curCourse.label;
            this.selectedCourseList[index].freeNum = curCourse.freeNum
            this.selectedCourseList[index].unitPrice  = curCourse.unitPrice;
            this.selectedCourseList[index].coachId = curCourse.coachId;
            this.selectedCourseList[index].coachNo = curCourse.coachNo;
            this.selectedCourseList[index].coachName = curCourse.coachName;
            this.selectedCourseList[index].courseNum = 1;
            this.selectedCourseList[index].integral = 1;
            this.selectedCourseList[index].actualAmount = curCourse.actualAmount;
            this.selectedCourseList[index].totalNum = curCourse.totalNum;
            this.selectedCourseList[index].execCoachId = null;
            let curCoachList =  this.getCoachListByCourseId(curCourseList,curCourseId);
            this.selectedCourseList[index].coachList = curCoachList;
            
        },
        usedNumChange:function(index,row){
            let freeNum = row.freeNum;
            let courseNum = row.courseNum;
            if(courseNum > freeNum){
                this.$message({
                    message: '消耗课时不能大于剩余课时',
                    type: 'warning'
                })
                return;
            }

        },
        getCoachListByCourseId:function(curCourseList,curCourseId){
            let coachList = []
            curCourseList.forEach(element => {
                if(element.id == curCourseId){
                    coachList =  element.coachList;
                    
                }
            });
            return coachList;
        },
        coachChange:function(index,row){
            this.selectedCourseList[index].execCoachId = row.execCoachId;
            let curCoach = util.getItemByValue(row.execCoachId,row.coachList);
            this.selectedCourseList[index].execCoachNo = curCoach.coachNo;
            this.selectedCourseList[index].execCoachName = curCoach.coachName;
        },
        addRow:function(){
            this.$emit('addMemCourse')
        },
        updateSelectdCourse:function(){
            this.$emit('refreshSelectedCourses',this.selectedCourseList)
        }
    },
    watch:{
        selectedCourseList:{
            handler: function (val, oldVal) {
                this.updateSelectdCourse();
             },
            deep: true
        }
    }
}
</script>
