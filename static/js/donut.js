/**
 * @class Donut
 */
class Donut {


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

    arc = d3.arc()
        .innerRadius(50)
        .outerRadius(100)

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = this.count_by_feature(_data, 'prog_lang');
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

        // Set up d3 object
        //vis.arcs = d3.pie()(vis.data2);
        vis.arcs = d3.pie()
            .value(function(d) { return d.count; })
            (vis.data);

        // Set up the svg/g work space
        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(180px, 180px)`);

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var arcs = vis.g.selectAll("g.slice")
            .data(vis.arcs)
            .enter()
            .append("svg:g")
            .attr("class", "slice");

        arcs.append("path")
            .style("fill", function(d,i){return color(i);})
            .attr('d', vis.arc)

        vis.g.append("text")
            .attr("transform", "translate(0px, 0px)")
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text("Languages")
            .attr("class", "hovertext");
            //.text(function(d, i) { return vis.data[i].prog_lang + ": " + vis.data[i].count; }) 

        arcs.on('mouseover', function (d, i) {
                d3.select(this).transition()
                   .duration('50')
                   .attr('opacity', '.85');
                vis.g.selectAll("text.hovertext")
                    .text(vis.data[i].prog_lang + ": " + vis.data[i].count);
            });
        
         arcs.on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                vis.g.selectAll("text.hovertext")
                    .text("Languages");
            });
    }

    count_by_feature(_data, _feature) {
        var new_data_dict = {};
        for (var i = 0; i < _data.length; i++) {
            var record = _data[i];
            var feature_val = record[_feature];
            if (feature_val in new_data_dict) {
                new_data_dict[feature_val] = new_data_dict[feature_val] + 1;
            } else {
                new_data_dict[feature_val] = 1;
            }
        } 
        var new_data_list = [];
        for (var key in new_data_dict) {
            var temp_dict = {};
            temp_dict[_feature] = key;
            temp_dict['count'] = new_data_dict[key];
            new_data_list.push(temp_dict);
        }
        return new_data_list;
    }
}
