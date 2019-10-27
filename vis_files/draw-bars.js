async function drawBars() {

    // Access data

    path = "./yang_processed_date_counts.csv"
    const dataset = await d3.csv(path, d3.autoType);

    sigDatesPath = './yang_sig_date_counts.csv'
    const sigDatesData = await d3.csv(sigDatesPath, d3.autoType);
    // console.log(dataset[0])

    // Create Accessors
    dateAccessor = d => d.date
    countAccessor = d => d.count

    // Create Dimensions

    const width = 1000

    let dimensions = {
        width: width,
        height: width * 0.5,
        margin: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 10,
        },
    }

    dimensions.boundedWidth = dimensions.width 
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom
    
    // Draw Canvas

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
        dimensions.margin.left
        }px, ${
        dimensions.margin.top
        }px)`)

    // Create Scales
    const xScale = d3.scaleUtc()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, dimensions.boundedWidth])
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, countAccessor))
        .range([dimensions.boundedHeight, 0])

    console.log(yScale(countAccessor(dataset[90])))

    // Draw Data
    // Creating Bars
    const bars = bounds.append('g')
            .attr('fill', '#B2B2B2')
        .selectAll('rect')
        .data(dataset)
        .join('rect')
            .attr('x', d => xScale(dateAccessor(d)))
            .attr('y', d => yScale(countAccessor(d)))
            .attr('height', d => yScale(0) - yScale(countAccessor(d)))
            .attr('width', 5)
    
    // Draw significant bars
    const sigBars = bounds.append('g')
        .selectAll('rect')
        .data(sigDatesData)
        .join('rect')
            .attr('x', d => xScale(dateAccessor(d)))
            .attr('y', d => yScale(countAccessor(d)))
            .attr('height', d => yScale(0) - yScale(countAccessor(d)))
            .attr('width', 5)
            .attr('fill', 'black')

    // Draw Peripherals 
    // Draw x-axis
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .ticks(3)
        .tickSize(0)
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
            .style("transform", `translateY(${
                dimensions.boundedHeight + 5
            }px)`)
        .style("color", "#878787")

    // Draw y-axis
    const yAxisGenerator = d3.axisRight()
        .scale(yScale)
        .ticks(4)
        .tickSize(0)

    const yAxis = bounds.append('g')
        .call(yAxisGenerator)
        .attr("transform", `translate(${
            dimensions.boundedWidth + 8
        }, 0)`)
        .style('color', "#878787")

    // Label y-axis 
    const yAxisLabel = wrapper.append("text")
        .attr("x", dimensions.width * 0.83)
        .attr("y", dimensions.height * 0.09)
        .attr("fill", "black")
        .style("font-size", "0.8em")
        .attr('font-family', 'Helvetica')
        .text("Contributions per Day")

    // Annotation for data source
    const sourceText = wrapper.append("text")
        .attr('x', dimensions.width * 0.02)
        .attr('y', dimensions.height * 0.1)
        .attr('fill', '#B2B2B2')
        .attr('font-size', '0.8em')
        .attr('font-family', 'Helvetica')
        .text('Data Source: https://www.fec.gov/')

    // Graph Annotations
    const type = d3.annotationCallout

    const annotations = [
        {
            note: {
                label: "1472 contributions",
                title: "June Debate"
            },
            data: {date: "2019-6-29", count: 550},
            dy: -5,
            dx: -10,
            subject: {
                radius: 25,
                radiusPadding: 1.5
            }
        },
        {
            note: {
                label: '3103 contributions',
                title: 'July Debate'
            },
            data: {date: '2019-7-31', count: 850},
            dy: -20,
            dx: -10,
            subject: {
                radius: 25,
                radiusPadding: 1.5
            }
        },
        {
            note: {
                label: '4825 contributions',
                title: 'Sept Debate'
            },
            data: {date: '2019-9-13', count: 1600},
            dy: -50,
            dx: -40,
            subject: {
                radius: 25,
                radiusPadding: 1.5
            }
        },
        {
            note: {
                title: 'Sept 30th',
                label: '4397 contributions!'
            },
            data: {date: '2019-9-29', count: 4300},
            dy: 10,
            dx: -50,
            subject: {
                radius: 25,
                radiusPadding: 1.5
            }
        }
    ]

    const parseTime = d3.timeParse("%Y-%m-%d")
    console.log(parseTime('2019-6-26'))

    const makeAnnotations = d3.annotation()
        .editMode(false)
        .notePadding(10)
        .type(type)
        .accessors({
            x: d => xScale(parseTime(d.date)),
            y: d => yScale(d.count)
        })
        .annotations(annotations)

    const anno = bounds.append("g")
        .attr("class", "annotation-group")
        .attr("font-family", "Helvetica")
        .call(makeAnnotations)

}
drawBars()