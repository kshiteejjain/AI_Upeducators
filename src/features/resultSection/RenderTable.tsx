// Sample JSON data
const data = {
    "criteria": [
        {
          "name": "Research Quality",
          "levels": [
            {
              "performance_level": "Exemplary",
              "description": "Extensive and accurate research conducted. All information is relevant and well-cited from credible sources.",
              "points": 20
            },
            {
              "performance_level": "Proficient",
              "description": "Sufficient research conducted with mostly accurate information. Most sources are relevant and properly cited.",
              "points": 15
            },
            {
              "performance_level": "Needs Improvement",
              "description": "Limited research with many inaccuracies. Sources are often irrelevant or not cited appropriately.",
              "points": 10
            }
          ]
        },
        {
          "name": "Analysis Depth",
          "levels": [
            {
              "performance_level": "Exemplary",
              "description": "Comprehensive analysis demonstrating critical thinking and thorough understanding of economic sectors.",
              "points": 20
            },
            {
              "performance_level": "Proficient",
              "description": "Solid analysis with a good understanding of the economic sectors, but may lack depth in some areas.",
              "points": 15
            },
            {
              "performance_level": "Needs Improvement",
              "description": "Superficial analysis that shows minimal understanding of the economic sectors, lacking insight and depth.",
              "points": 10
            }
          ]
        },
        {
          "name": "Collaboration Effectiveness",
          "levels": [
            {
              "performance_level": "Exemplary",
              "description": "Teamwork is outstanding. All members contributed significantly and effectively communicated throughout the project.",
              "points": 20
            },
            {
              "performance_level": "Proficient",
              "description": "Good collaboration with most team members contributing and communicating well. Minor issues may exist.",
              "points": 15
            },
            {
              "performance_level": "Needs Improvement",
              "description": "Poor collaboration with limited contributions from members. Communication issues hindered the project.",
              "points": 10
            }
          ]
        },
        {
          "name": "Presentation Clarity",
          "levels": [
            {
              "performance_level": "Exemplary",
              "description": "Presentation is highly organized, clear, and engaging. Visual aids enhance understanding.",
              "points": 20
            },
            {
              "performance_level": "Proficient",
              "description": "Presentation is organized and clear but may lack engagement. Visual aids are used but not always effectively.",
              "points": 15
            },
            {
              "performance_level": "Needs Improvement",
              "description": "Presentation is disorganized and unclear. Visual aids are poorly used or absent, reducing clarity.",
              "points": 10
            }
          ]
        },
        {
          "name": "Creativity",
          "levels": [
            {
              "performance_level": "Exemplary",
              "description": "Highly creative approach to the topic. Unique ideas and methods show innovation and originality.",
              "points": 20
            },
            {
              "performance_level": "Proficient",
              "description": "Some creative elements present, but relies on familiar ideas or approaches. Originality is limited.",
              "points": 15
            },
            {
              "performance_level": "Needs Improvement",
              "description": "Little to no creativity shown. Relies on clichés and does not demonstrate innovative thinking.",
              "points": 10
            }
          ]
        }
      ],
    "total_points": 100
};

const RenderTable = () => {
    return (
        <div>
            <div className="tableWrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            <th>Performance Level</th>
                            <th>Description</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.criteria.map((criterion, index) => (
                            criterion.levels.map((level, levelIndex) => (
                                <tr key={`${index}-${levelIndex}`}>
                                    {levelIndex === 0 && (
                                        <td rowSpan={criterion.levels.length}>
                                            {criterion.name}
                                        </td>
                                    )}
                                    <td>{level.performance_level}</td>
                                    <td>{level.description}</td>
                                    <td>{level.points}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
            <p>Total Points: {data.total_points}</p>
        </div>
    );
};
export default RenderTable;