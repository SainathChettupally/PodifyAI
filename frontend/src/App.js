import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  styled,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Audiotrack as AudiotrackIcon, InsertDriveFile, Speed, Psychology, RecordVoiceOver } from '@mui/icons-material';
import logo from './Podify_logo_final.png';

const Dropzone = styled('div')(({ theme, isDragActive }) => ({
  border: `2px dashed ${theme.palette.text.secondary}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
  transition: 'background-color 0.3s ease',
  marginBottom: theme.spacing(2)
}));

function App() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('standard');
  const [language, setLanguage] = useState('es');
  const [modelType, setModelType] = useState('standard'); // 'standard' or 'gemini'
  const [voice, setVoice] = useState('standard'); // 'standard' or Gemini voice names

  const [originalSummary, setOriginalSummary] = useState('');
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [metrics, setMetrics] = useState(null);

  const [audioUrl, setAudioUrl] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onFileClick = (event) => {
    handleFileChange(event.target.files[0]);
  }

  const handleGenerate = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    formData.append('language', language);
    formData.append('model_type', modelType);

    setIsLoading(true);
    setOriginalSummary('');
    setTranslatedSummary('');
    setAudioUrl('');
    setMetrics(null);

    try {
      const response = await axios.post('http://localhost:5000/api/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOriginalSummary(response.data.originalSummary);
      setTranslatedSummary(response.data.translatedSummary);
      setMetrics(response.data.metrics);
      setActiveTab(0);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!translatedSummary) {
      alert('Please generate a summary first.');
      return;
    }

    setIsGeneratingAudio(true);
    setAudioUrl('');

    try {
      const response = await axios.post('http://localhost:5000/api/generate-audio', {
        translatedSummary,
        language,
        voice
      });
      setAudioUrl(`http://localhost:5000${response.data.audioUrl}`);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. Please check the console for details.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <img src={logo} alt="PodifyAI Logo" style={{ height: 200, width: 200, marginRight: 16 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              PodifyAI
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary', mt: -0.5 }}>
              Documents that speak
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" gutterBottom>
                  Your Podium
                </Typography>

                <FormControl fullWidth margin="normal">
                  <input
                    accept="application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={onFileClick}
                  />
                  <label htmlFor="raised-button-file">
                    <Dropzone
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      isDragActive={isDragActive}
                    >
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                      <Typography>Drag & drop a file here, or click to select a file</Typography>
                    </Dropzone>
                  </label>
                  {fileName && <Typography variant="body2" sx={{ mt: 1 }}><InsertDriveFile fontSize='small' sx={{ verticalAlign: 'middle', mr: 1 }} />{fileName}</Typography>}
                </FormControl>

                <Divider sx={{ my: 2 }} />

                {/* Model Selection */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Psychology sx={{ mr: 1 }} /> AI Model
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={modelType === 'gemini'}
                        onChange={(e) => setModelType(e.target.checked ? 'gemini' : 'standard')}
                        color="secondary"
                      />
                    }
                    label={modelType === 'gemini' ? "Gemini (Advanced)" : "DistilBART (Standard)"}
                  />
                </Box>

                <FormControl component="fieldset" margin="normal" fullWidth>
                  <Typography component="legend" sx={{ mb: 1 }}>Summary Mode</Typography>
                  <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(e, newMode) => { if (newMode) setMode(newMode) }}
                    aria-label="summary mode"
                    fullWidth
                  >
                    <ToggleButton value="quick" aria-label="quick mode">
                      Quick
                    </ToggleButton>
                    <ToggleButton value="standard" aria-label="standard mode">
                      Standard
                    </ToggleButton>
                    <ToggleButton value="deep" aria-label="deep mode">
                      Deep
                    </ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="language-select-label">Target Language</InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={language}
                    label="Target Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="it">Italian</MenuItem>
                    <MenuItem value="pt">Portuguese</MenuItem>
                    <MenuItem value="hi">Hindi</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ mt: 2, position: 'relative' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    size="large"
                  >
                    {isLoading ? 'Generating...' : 'Generate Summary'}
                  </Button>
                  {isLoading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: 'primary.main',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                {originalSummary || translatedSummary ? (
                  <>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        aria-label="summary tabs"
                        TabIndicatorProps={{
                          style: {
                            backgroundColor: '#4dd0e1'
                          }
                        }}
                      >
                        <Tab label="Original Summary" />
                        <Tab label="Translated Summary" />
                      </Tabs>
                      {metrics && (
                        <Chip
                          icon={<Speed />}
                          label={`${metrics.totalTime}s`}
                          variant="outlined"
                          size="small"
                          sx={{ mr: 2 }}
                          title={`Extraction: ${metrics.extractionTime}s, Summarization: ${metrics.summarizationTime}s, Translation: ${metrics.translationTime}s`}
                        />
                      )}
                    </Box>
                    <Paper elevation={0} sx={{ p: 3, mt: 2, minHeight: 200, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {activeTab === 0 ? originalSummary : translatedSummary}
                    </Paper>
                    {activeTab === 1 && translatedSummary && (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel id="voice-select-label">Voice</InputLabel>
                              <Select
                                labelId="voice-select-label"
                                value={voice}
                                label="Voice"
                                onChange={(e) => setVoice(e.target.value)}
                              >
                                <MenuItem value="standard">Standard (Robotic)</MenuItem>
                                <MenuItem value="Puck">Puck (Gemini - Male)</MenuItem>
                                <MenuItem value="Charon">Charon (Gemini - Male)</MenuItem>
                                <MenuItem value="Kore">Kore (Gemini - Female)</MenuItem>
                                <MenuItem value="Fenrir">Fenrir (Gemini - Male)</MenuItem>
                                <MenuItem value="Aoede">Aoede (Gemini - Female)</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ position: 'relative' }}>
                              <Button
                                fullWidth
                                variant="contained"
                                startIcon={<AudiotrackIcon />}
                                onClick={handleGenerateAudio}
                                disabled={isGeneratingAudio}
                              >
                                {isGeneratingAudio ? 'Generating Audio...' : 'Generate Audio'}
                              </Button>
                              {isGeneratingAudio && (
                                <CircularProgress
                                  size={24}
                                  sx={{
                                    color: 'primary.main',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                  }}
                                />
                              )}
                            </Box>
                          </Grid>
                        </Grid>

                        {audioUrl && (
                          <audio controls src={audioUrl} style={{ width: '100%', marginTop: 16 }}>
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </Box>
                    )}
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                    <Typography variant="h6" color="text.secondary">
                      Your summaries will appear here.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
