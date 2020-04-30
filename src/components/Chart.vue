<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { HorizontalBar } from 'vue-chartjs';
    import { Prop } from 'vue-property-decorator';

    @Component({
        extends: HorizontalBar
    })
    export default class Chart extends Vue {
        @Prop({ default: () => ({}) })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public results: any;
        public chartdata = {
            labels: [1, 2, 3, 5],
            datasets: [
                {
                    label: 'Results',
                    backgroundColor: '#f87979',
                    data: [2, 3, 1]
                }
            ]
        };

        protected mounted(): void {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).renderChart(this.results, {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Résultats'
                }
            });
        }
    }
</script>
