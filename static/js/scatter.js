/**
 * @class Scatter
 */
class Scatter {

    // Vars
    data_bins = [];

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools
    scX = d3.scaleLinear()
            .range([0, this.gW]);
    scY = d3.scaleLinear()
            .range([this.gH, 0]);

    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('Years of Experience');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('Homework Hours');


        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;

        // Map ages
        const expMap = vis.data.map(d => d.experience_yr);
        const hw1Map = vis.data.map(d => d.hw1_hrs);

        // Update scales
        vis.scX.domain(d3.extent(expMap,d => d));
        vis.scY.domain(d3.extent(hw1Map,d => d));
        vis.xAxis.scale(vis.scX);
        vis.yAxis.scale(vis.scY);


        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        vis.g.selectAll('circleG')
            .data(vis.data)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'circleG')
                    .each(function(d, i) {
                        const g = d3.select(this);

                        const x = vis.scX(d.experience_yr);
                        const y = vis.scY(d.hw1_hrs);
                        const size = d.age / 7.0;
                        
                        g.style('transform', `translate(${x}px, ${y}px)`);

                        g.append('circle')
                            .attr('r', `${size}`)
                            .style("fill", color(i));


                        g.append('text')
                            .style('transform', `translate(0px, 15px)`)
                            .style('fill', color(i))
                            .attr("text-anchor", "middle")
                            .text(d.first_name)
                            .attr("class", i)
                            .attr('opacity', '.0');

                        g.on('mouseover', function(d,i) {
                            d3.select(this).selectAll('text')
                                .transition()
                               .duration('50')
                               .attr('opacity', '1');
                        });

                        g.on('mouseout', function(d,i) {
                            d3.select(this).selectAll('text')
                                .transition()
                               .duration('50')
                               .attr('opacity', '0');
                        });

                    })
            );

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}
