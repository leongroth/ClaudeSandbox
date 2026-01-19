import React, { useState, useMemo } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';

// Types
interface Resource {
  id: string;
  type: 'White Paper' | 'Infographic' | 'Video';
  title: string;
  description: string;
  url: string;
  tags: string[];
  date?: string;
}

interface FilterState {
  search: string;
  selectedTypes: string[];
  selectedTags: string[];
  selectedDate: string;
}

// Sample data
const sampleResources: Resource[] = [
  {
    id: '1',
    type: 'White Paper',
    title: 'Understanding and Mitigating MCP Ecosystem Risks',
    description: 'Explore key security risks in today\'s MCP tooling, data on MCP security prevalence, and guidance for building a secure, production-ready agent infrastructure.',
    url: '#',
    tags: ['Docker MCP', 'Security'],
    date: '2024'
  },
  {
    id: '2',
    type: 'Infographic',
    title: 'MCP Security: Where the Risks Lie and How to Contain Them',
    description: 'Learn how MCP works, key MCP security risks, and practical tips to contain these vulnerabilities.',
    url: '#',
    tags: ['Docker MCP', 'Security'],
    date: '2024'
  },
  {
    id: '3',
    type: 'White Paper',
    title: 'IDC MCP Security Paper',
    description: 'Discover why MCP adoption is rising, the security challenges slowing it down, and how Docker makes agentic AI enterprise-ready.',
    url: '#',
    tags: ['Docker MCP', 'AI/ML', 'Enterprise'],
    date: '2024'
  },
  {
    id: '4',
    type: 'Video',
    title: 'The Future of Agentic Apps: Building and Running MCP Servers the Right Way',
    description: 'Learn how to run and build an MCP server for your agentic applications using Docker tools and best practices.',
    url: '#',
    tags: ['Docker MCP'],
    date: '2024'
  }
];

// Badge component
const Badge: React.FC<{ type: Resource['type'] }> = ({ type }) => {
  const styles = {
    'White Paper': { bg: '#e8f5e9', color: '#2e7d32' },
    'Infographic': { bg: '#e3f2fd', color: '#1976d2' },
    'Video': { bg: '#fff3e0', color: '#f57c00' }
  };

  const style = styles[type];

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: style.bg,
      color: style.color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {type}
    </span>
  );
};

// SearchInput component
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div style={{ position: 'relative', marginBottom: '24px' }}>
      <Search 
        size={20} 
        style={{ 
          position: 'absolute', 
          left: '12px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: '#6c757d'
        }} 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px 10px 40px',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#0066cc'}
        onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
      />
    </div>
  );
};

// Checkbox component
const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}> = ({ label, checked, onChange, count }) => {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#1a1a1a'
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '16px',
          height: '16px',
          marginRight: '8px',
          cursor: 'pointer',
          accentColor: '#0066cc'
        }}
      />
      <span>{label}</span>
      {count !== undefined && (
        <span style={{ marginLeft: '4px', color: '#6c757d' }}>({count})</span>
      )}
    </label>
  );
};

// FilterSidebar component
const FilterSidebar: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}> = ({ filters, onFilterChange, onReset }) => {
  const types = ['White Papers', 'Infographics', 'Videos'];
  const tags = ['AI/ML', 'Docker MCP', 'Enterprise', 'Security'];

  const handleTypeToggle = (type: string) => {
    const types = filters.selectedTypes.includes(type)
      ? filters.selectedTypes.filter(t => t !== type)
      : [...filters.selectedTypes, type];
    onFilterChange({ ...filters, selectedTypes: types });
  };

  const handleTagToggle = (tag: string) => {
    const tags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    onFilterChange({ ...filters, selectedTags: tags });
  };

  return (
    <aside style={{
      width: '280px',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      height: 'fit-content'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          Filters
        </h2>
        <button
          onClick={onReset}
          style={{
            padding: '4px 12px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: '#6c757d',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Reset
        </button>
      </div>

      <SearchInput
        value={filters.search}
        onChange={(value) => onFilterChange({ ...filters, search: value })}
        placeholder="Looking for something specific?"
      />

      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#1a1a1a'
        }}>
          Date
        </label>
        <select
          value={filters.selectedDate}
          onChange={(e) => onFilterChange({ ...filters, selectedDate: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 32px 8px 12px',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236c757d' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center'
          }}
        >
          <option value="">Select year</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#1a1a1a'
        }}>
          Type
        </label>
        {types.map((type, idx) => (
          <Checkbox
            key={type}
            label={type}
            checked={filters.selectedTypes.includes(type)}
            onChange={() => handleTypeToggle(type)}
            count={idx === 0 ? 2 : 1}
          />
        ))}
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#1a1a1a'
        }}>
          Tags
        </label>
        {tags.map((tag, idx) => (
          <Checkbox
            key={tag}
            label={tag}
            checked={filters.selectedTags.includes(tag)}
            onChange={() => handleTagToggle(tag)}
            count={idx === 1 ? 4 : idx === 3 ? 4 : 3}
          />
        ))}
      </div>
    </aside>
  );
};

// ResourceCard component
const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  return (
    <article style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{ marginBottom: '12px' }}>
        <Badge type={resource.type} />
      </div>
      
      <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: '1.4'
      }}>
        {resource.title}
      </h3>

      <p style={{
        margin: '0 0 16px 0',
        fontSize: '15px',
        color: '#6c757d',
        lineHeight: '1.5',
        flexGrow: 1
      }}>
        {resource.description}
      </p>

      <a
        href={resource.url}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#0066cc',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'gap 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.gap = '10px';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.gap = '6px';
        }}
      >
        {resource.type === 'Video' ? 'Watch now' : 'Read now'}
        <ArrowRight size={16} />
      </a>
    </article>
  );
};

// ResourceGrid component
const ResourceGrid: React.FC<{ resources: Resource[] }> = ({ resources }) => {
  if (resources.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6c757d'
      }}>
        <p style={{ fontSize: '18px', margin: 0 }}>No resources found</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px'
    }}>
      {resources.map(resource => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

// Main ResourceLibrary component
const ResourceLibrary: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedTypes: [],
    selectedTags: [],
    selectedDate: ''
  });

  const [sortBy, setSortBy] = useState<string>('relevance');

  const handleReset = () => {
    setFilters({
      search: '',
      selectedTypes: [],
      selectedTags: [],
      selectedDate: ''
    });
  };

  const filteredResources = useMemo(() => {
    let filtered = [...sampleResources];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.selectedTypes.length > 0) {
      filtered = filtered.filter(resource => {
        const singularType = resource.type;
        return filters.selectedTypes.some(filterType => {
          const normalizedFilter = filterType.endsWith('s') 
            ? filterType.slice(0, -1) 
            : filterType;
          return singularType === normalizedFilter;
        });
      });
    }

    // Tag filter
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(resource =>
        filters.selectedTags.some(tag => resource.tags.includes(tag))
      );
    }

    // Date filter
    if (filters.selectedDate) {
      filtered = filtered.filter(resource => 
        resource.date === filters.selectedDate
      );
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    }

    return filtered;
  }, [filters, sortBy]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            All resources
          </h1>

          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 36px 8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236c757d' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center'
              }}
            >
              <option value="relevance">Sort results by</option>
              <option value="date">Date (newest first)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start'
        }}>
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleReset}
          />

          <main style={{ flex: 1, minWidth: 0 }}>
            <ResourceGrid resources={filteredResources} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;