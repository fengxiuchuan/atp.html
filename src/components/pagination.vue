<template>
    <section>
        	<el-col :span="24" class="toolbar">
			        <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageination.pageSize"
                        layout="total, sizes,prev, pager,next"
                        :total="total">
                    </el-pagination>
			</el-col>
    </section>
</template>

<script>
export default{
    data(){
        return {
            pageination:{
                pageSize:this.pageSize,
                total:this.total,
                page:this.currentPage
            }
        }
    },
    props:{
        pageSize:{
            type:Number,
            default:10
        },
        total:{
            type:Number,
            default:0
        },
         currentPage: {
            type: Number,
            default: 1
        }
    },
    methods:{
        handleCurrentChange: function(val){
            this.pageination.page = val;
            this.$emit('search',this.pageination);
        },
        handleSizeChange: function(val){
            this.pageination.pageSize = val;
            this.$emit('search',this.pageination);
        },
        
    }
   
}
</script>
