import React from 'react';

function SimpleApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #fef3c7 100%)',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 50%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          TurboTags
        </div>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
          Free AI Tags & Hashtags Generator for YouTube, TikTok, Instagram & Facebook
        </p>
      </header>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
          }}>
            🌍 30+ Regions Supported
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
          }}>
            🤖 AI Title & Tag Generation
          </span>
          <span style={{
            background: 'white',
            color: '#2563eb',
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            fontWeight: '600',
            border: '2px solid #2563eb',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
          }}>
            📊 SEO Optimized
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 50%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.2,
          marginBottom: '1rem'
        }}>
          Generate Viral Tags & Hashtags with AI
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          marginBottom: '2rem',
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }}>
          Smarter Reach. Faster Growth. 🚀<br/>
          Generate viral tags, trending hashtags, and SEO-optimized titles for YouTube, TikTok, Instagram, and Facebook.
        </p>
      </section>

      {/* Tag Generator */}
      <section style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginBottom: '3rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '2rem'
        }}>
          Start Generating Tags & Hashtags
        </h2>
        
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Enter your content topic or keywords:
            </label>
            <textarea
              placeholder="e.g., gaming tutorial, cooking recipes, travel vlog..."
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                minHeight: '120px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🚀 Generate AI Tags & Hashtags
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          TurboTags - The Ultimate Free Tool for Content Creators
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Home</a>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>About</a>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Features</a>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Blog</a>
        </div>
      </footer>
    </div>
  );
}

export default SimpleApp;