interface Version {
  description: string;
  tarball: string;
  homepage?: string;
  readme?: string;
}

export interface Extension {
  author?: string;
  name: string;
  description?: string;
  versions: {
    [key: string]: Version;
  };
  secret: string;
  latest: string;
  lang: string;
}
