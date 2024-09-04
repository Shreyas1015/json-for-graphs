import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import Plot from "react-plotly.js";

const GraphForm = () => {
  const [formData, setFormData] = useState({
    info: {
      shortname: "",
      name: "",
      description: "",
      type: "",
      time_series_metric: "",
    },
    data: {
      table: "",
      where: [{ column: "", operator: "", value: "" }],
      metrics: [
        { name: "", expression: "", type: "", group_by: "", labels: [] },
      ],
    },
    axis: [{ x: "", y: "" }],
  });
  const [graphData, setGraphData] = useState(null);

  const handleInputChange = (e, section, key, index = null) => {
    const value = e.target.value;

    setFormData((prevData) => {
      const newData = { ...prevData };

      if (index !== null) {
        if (Array.isArray(newData[section])) {
          newData[section][index] = {
            ...newData[section][index],
            [key]: value,
          };
        } else if (newData.data && Array.isArray(newData.data[section])) {
          newData.data[section][index] = {
            ...newData.data[section][index],
            [key]: value,
          };
        }
      } else {
        newData[section][key] = value;
      }

      return newData;
    });
  };

  const handleAddWhereClause = () => {
    setFormData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        where: [
          ...prevData.data.where,
          { column: "", operator: "", value: "" },
        ],
      },
    }));
  };

  const handleDeleteWhereClause = (index) => {
    setFormData((prevData) => {
      const newWhere = prevData.data.where.filter((_, i) => i !== index);
      return { ...prevData, data: { ...prevData.data, where: newWhere } };
    });
  };

  const handleAddMetric = () => {
    setFormData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        metrics: [
          ...prevData.data.metrics,
          { name: "", expression: "", type: "", group_by: "", labels: [] },
        ],
      },
    }));
  };

  const handleDeleteMetric = (index) => {
    setFormData((prevData) => {
      const newMetrics = prevData.data.metrics.filter((_, i) => i !== index);
      return { ...prevData, data: { ...prevData.data, metrics: newMetrics } };
    });
  };

  const handleAddAxis = () => {
    setFormData((prevData) => ({
      ...prevData,
      axis: [...prevData.axis, { x: "", y: "" }],
    }));
  };

  const handleDeleteAxis = (index) => {
    setFormData((prevData) => {
      const newAxis = prevData.axis.filter((_, i) => i !== index);
      return { ...prevData, axis: newAxis };
    });
  };

  const handleAddLabel = (metricIndex) => {
    setFormData((prevData) => {
      const newMetrics = [...prevData.data.metrics];
      newMetrics[metricIndex].labels = [...newMetrics[metricIndex].labels, ""];
      return { ...prevData, data: { ...prevData.data, metrics: newMetrics } };
    });
  };

  const handleLabelChange = (e, metricIndex, labelIndex) => {
    const value = e.target.value;

    setFormData((prevData) => {
      const newData = { ...prevData };
      newData.data.metrics[metricIndex].labels[labelIndex] = value;
      return newData;
    });
  };

  const handleDeleteLabel = (metricIndex, labelIndex) => {
    setFormData((prevData) => {
      const newMetrics = [...prevData.data.metrics];
      newMetrics[metricIndex].labels = newMetrics[metricIndex].labels.filter(
        (_, i) => i !== labelIndex
      );
      return { ...prevData, data: { ...prevData.data, metrics: newMetrics } };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData, null, 2);
    const parsedData = JSON.parse(jsonData);
    console.log(parsedData);
    console.log(jsonData);

    const plotlyData = formData.data.metrics.map((metric) => {
      if (formData.info.type === "pie") {
        return {
          values: metric.values,
          labels: metric.labels,
          type: "pie",
          name: metric.name,
        };
      } else {
        return {
          x: formData.axis.map((point) => point.x),
          y: formData.axis.map((point) => point.y),
          type: formData.info.type,
          name: metric.name,
        };
      }
    });

    setGraphData(plotlyData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: 5 }}>
      <Typography variant="h6" gutterBottom>
        Graph Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Shortname"
            value={formData.info.shortname}
            onChange={(e) => handleInputChange(e, "info", "shortname")}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Name"
            value={formData.info.name}
            onChange={(e) => handleInputChange(e, "info", "name")}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={formData.info.description}
            onChange={(e) => handleInputChange(e, "info", "description")}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            value={formData.info.type}
            onChange={(e) => handleInputChange(e, "info", "type")}
            fullWidth
            displayEmpty
            required
          >
            <MenuItem value="">Select Graph Type</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Time Series Metric"
            value={formData.info.time_series_metric}
            onChange={(e) => handleInputChange(e, "info", "time_series_metric")}
            fullWidth
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Data Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Table"
            value={formData.data.table}
            onChange={(e) => handleInputChange(e, "data", "table")}
            fullWidth
            required
          />
        </Grid>

        {formData.data.where.map((whereClause, index) => (
          <React.Fragment key={index}>
            <br />
            <Grid item xs={12} sm={3}>
              <TextField
                label="Column"
                value={whereClause.column}
                onChange={(e) => handleInputChange(e, "where", "column", index)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Operator"
                value={whereClause.operator}
                onChange={(e) =>
                  handleInputChange(e, "where", "operator", index)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Value"
                value={whereClause.value}
                onChange={(e) => handleInputChange(e, "where", "value", index)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                onClick={() => handleDeleteWhereClause(index)}
                variant="outlined"
                color="error"
                fullWidth
              >
                Delete
              </Button>
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <Button
            onClick={handleAddWhereClause}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            Add Where Clause
          </Button>
        </Grid>

        {formData.data.metrics.map((metric, index) => (
          <React.Fragment key={index}>
            <Grid container spacing={2} style={{ margin: "8px 0" }}>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Metric Name"
                  value={metric.name}
                  onChange={(e) =>
                    handleInputChange(e, "metrics", "name", index)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Expression"
                  value={metric.expression}
                  onChange={(e) =>
                    handleInputChange(e, "metrics", "expression", index)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Type"
                  value={metric.type}
                  onChange={(e) =>
                    handleInputChange(e, "metrics", "type", index)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Group By"
                  value={metric.group_by}
                  onChange={(e) =>
                    handleInputChange(e, "metrics", "group_by", index)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  onClick={() => handleDeleteMetric(index)}
                  variant="outlined"
                  color="error"
                  fullWidth
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
            {formData.info.type === "pie" && (
              <Grid container spacing={2}>
                {metric.labels.map((label, labelIndex) => (
                  <Grid item xs={12} sm={3} key={labelIndex}>
                    <TextField
                      label={`Label ${labelIndex + 1}`}
                      value={label}
                      onChange={(e) => handleLabelChange(e, index, labelIndex)}
                      fullWidth
                    />
                    <Button
                      onClick={() => handleDeleteLabel(index, labelIndex)}
                      variant="outlined"
                      color="error"
                      fullWidth
                    >
                      Delete Label
                    </Button>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    onClick={() => handleAddLabel(index)}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                  >
                    Add Label
                  </Button>
                </Grid>
              </Grid>
            )}
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <Button
            onClick={handleAddMetric}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            Add Metric
          </Button>
        </Grid>
      </Grid>

      {/* Axis Info Fields */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Axis Information
      </Typography>
      <Grid container spacing={2}>
        {formData.axis.map((axisPoint, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="X Axis"
                value={axisPoint.x}
                onChange={(e) => handleInputChange(e, "axis", "x", index)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Y Axis"
                value={axisPoint.y}
                onChange={(e) => handleInputChange(e, "axis", "y", index)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                onClick={() => handleDeleteAxis(index)}
                variant="outlined"
                color="error"
                fullWidth
              >
                Delete
              </Button>
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <Button
            onClick={handleAddAxis}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            Add Axis
          </Button>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        fullWidth
      >
        Submit
      </Button>

      {graphData && (
        <Plot
          data={graphData}
          layout={{ title: formData.info.name }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </Box>
  );
};

export default GraphForm;
