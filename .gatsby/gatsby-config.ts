import { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-s3',
      options: {
        bucketName: 'rush-hour.denni.dev'
      }
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve('../src/components/Layout/Layout.tsx')
      }
    }
  ]
};

export default config;
