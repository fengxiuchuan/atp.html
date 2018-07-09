<template>
    <section>
        
        <!--充值课程列表-->
        <el-table v-if="selectedCourseList != null && selectedCourseList.size > 0" :data="selectedCourseList" highlight-current-row  style="width: 100%;"  size="small">
            <el-table-column  label="订单编号" >
                <span>自动生成</span>
            </el-table-column>
            <el-table-column  label="课程名称" prop="courseIdArr" >
                <el-select name="courseIdArr"  v-model="selectedCourseList[scope.$index].courseIdArr"   filterable placeholder="请选择" @change="changeCoach(scope.$index, scope.row)">
                    <el-option
                    v-for="item in selectedCourseList[scope.$index].courseList"
                    :key="item.id"
                    :label="item.courseName"
                    :value="item.id" >
                    </el-option>
                </el-select>
            </el-table-column>
            <el-table-column label="课程教练" prop="coachIdArr" >
                 <el-select name="coachIdArr" v-model="selectedCourseList[scope.$index].coachIdArr"    filterable placeholder="请选择">
                    <el-option
                    v-for="item in selectedCourseList[scope.$index].coachList"
                    :key="item.id"
                    :label="item.coachName"
                    :value="item.id" >
                    </el-option>
                </el-select>
            </el-table-column>
            <el-table-column label="课时">
                <el-input type="number" placeholder="请输入课时数" v-model="selectedCourseList[scope.$index].totalNum">
                    <template slot="append">课时</template>
                </el-input>
            </el-table-column>
            <el-table-column label="课程费用">
                <el-input type="number" placeholder="请输入课程费用" v-model="selectedCourseList[scope.$index].courseAmount">
                    <template slot="prepend">&yen</template>
                </el-input>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" icon="el-icon-edit-outline" @click="delRow(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        
    </section>
</template>
<script>
export default {
    data:function(){
        return {
           
        }
    },
    props:['selectedCourseList'],
    methods:{
        //删除一行
        delRow:function(index,row){
            this.selectedCourseList.slice(index,0)
        },
        changeCoach:function(index,row){
            this.$emit('changeSelectedCourses',index,selectedCourseList,row.courseIdArr)
        }
    }
}
</script>
