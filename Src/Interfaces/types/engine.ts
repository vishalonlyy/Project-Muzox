type Engines = Partial<{
    DefaultEngine: string;
    SoundCloudEngine: string;
    PremiumEngine: string;
  }>;
  
  const engines: Engines = {
    DefaultEngine: 'ytsearch',
    SoundCloudEngine: 'scsearch',
    PremiumEngine: 'ytmsearch',
  };


  export default engines;