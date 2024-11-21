import Head from 'next/head';

const PageWrapper = (props) => {
  return (
    <div>
      <Head>
        <title>MES Client</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main id='host'>
        {props.children}
      </main>

    </div>
  )
}

export default PageWrapper;