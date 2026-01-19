import '@testing-library/jest-dom';

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

// Filtering utility functions
const filterBySearch = (resources: Resource[], searchTerm: string): Resource[] => {
  if (!searchTerm) return resources;
  const searchLower = searchTerm.toLowerCase();
  return resources.filter(resource =>
    resource.title.toLowerCase().includes(searchLower) ||
    resource.description.toLowerCase().includes(searchLower)
  );
};

const filterByType = (resources: Resource[], selectedTypes: string[]): Resource[] => {
  if (selectedTypes.length === 0) return resources;
  return resources.filter(resource => {
    const singularType = resource.type;
    return selectedTypes.some(filterType => {
      const normalizedFilter = filterType.endsWith('s') 
        ? filterType.slice(0, -1) 
        : filterType;
      return singularType === normalizedFilter;
    });
  });
};

const filterByTags = (resources: Resource[], selectedTags: string[]): Resource[] => {
  if (selectedTags.length === 0) return resources;
  return resources.filter(resource =>
    selectedTags.some(tag => resource.tags.includes(tag))
  );
};

const filterByDate = (resources: Resource[], selectedDate: string): Resource[] => {
  if (!selectedDate) return resources;
  return resources.filter(resource => resource.date === selectedDate);
};

const applyAllFilters = (resources: Resource[], filters: FilterState): Resource[] => {
  let filtered = [...resources];
  filtered = filterBySearch(filtered, filters.search);
  filtered = filterByType(filtered, filters.selectedTypes);
  filtered = filterByTags(filtered, filters.selectedTags);
  filtered = filterByDate(filtered, filters.selectedDate);
  return filtered;
};

describe('Filtering Logic', () => {
  const mockResources: Resource[] = [
    {
      id: '1',
      type: 'White Paper',
      title: 'Understanding MCP Security',
      description: 'A comprehensive guide to MCP security',
      url: '#',
      tags: ['Docker MCP', 'Security'],
      date: '2024'
    },
    {
      id: '2',
      type: 'Infographic',
      title: 'MCP Risks Visualization',
      description: 'Visual guide to MCP security risks',
      url: '#',
      tags: ['Docker MCP', 'Security'],
      date: '2024'
    },
    {
      id: '3',
      type: 'Video',
      title: 'Building MCP Servers',
      description: 'How to build MCP servers correctly',
      url: '#',
      tags: ['Docker MCP'],
      date: '2024'
    },
    {
      id: '4',
      type: 'White Paper',
      title: 'Enterprise AI Adoption',
      description: 'Guide to enterprise AI implementation',
      url: '#',
      tags: ['Enterprise', 'AI/ML'],
      date: '2023'
    }
  ];

  describe('filterBySearch', () => {
    test('filters by title case-insensitively', () => {
      const result = filterBySearch(mockResources, 'security');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('filters by description case-insensitively', () => {
      const result = filterBySearch(mockResources, 'visual');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    test('returns all resources when search is empty', () => {
      const result = filterBySearch(mockResources, '');
      expect(result).toHaveLength(4);
    });

    test('returns empty array when no matches', () => {
      const result = filterBySearch(mockResources, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByType', () => {
    test('filters by single type correctly', () => {
      const result = filterByType(mockResources, ['Videos']);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Video');
    });

    test('filters by multiple types', () => {
      const result = filterByType(mockResources, ['White Papers', 'Infographics']);
      expect(result).toHaveLength(3);
    });

    test('correctly maps plural to singular type', () => {
      const result = filterByType(mockResources, ['White Papers']);
      expect(result).toHaveLength(2);
      expect(result.every(r => r.type === 'White Paper')).toBe(true);
    });

    test('returns all resources when no types selected', () => {
      const result = filterByType(mockResources, []);
      expect(result).toHaveLength(4);
    });
  });

  describe('filterByTags', () => {
    test('filters by single tag using OR logic', () => {
      const result = filterByTags(mockResources, ['Docker MCP']);
      expect(result).toHaveLength(3);
    });

    test('filters by multiple tags using OR logic', () => {
      const result = filterByTags(mockResources, ['Docker MCP', 'Enterprise']);
      expect(result).toHaveLength(4);
    });

    test('returns all resources when no tags selected', () => {
      const result = filterByTags(mockResources, []);
      expect(result).toHaveLength(4);
    });

    test('returns resources that match ANY of the selected tags', () => {
      const result = filterByTags(mockResources, ['Security', 'AI/ML']);
      expect(result).toHaveLength(3);
    });
  });

  describe('filterByDate', () => {
    test('filters by specific date', () => {
      const result = filterByDate(mockResources, '2024');
      expect(result).toHaveLength(3);
    });

    test('returns all resources when no date selected', () => {
      const result = filterByDate(mockResources, '');
      expect(result).toHaveLength(4);
    });

    test('returns empty array when date has no matches', () => {
      const result = filterByDate(mockResources, '2022');
      expect(result).toHaveLength(0);
    });
  });

  describe('applyAllFilters - Combined Logic', () => {
    test('applies all filters together using AND logic', () => {
      const filters: FilterState = {
        search: 'MCP',
        selectedTypes: ['White Papers'],
        selectedTags: ['Security'],
        selectedDate: '2024'
      };

      const result = applyAllFilters(mockResources, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('returns all resources when no filters applied', () => {
      const filters: FilterState = {
        search: '',
        selectedTypes: [],
        selectedTags: [],
        selectedDate: ''
      };

      const result = applyAllFilters(mockResources, filters);
      expect(result).toHaveLength(4);
    });

    test('returns empty array when combined filters have no matches', () => {
      const filters: FilterState = {
        search: 'Security',
        selectedTypes: ['Videos'],
        selectedTags: [],
        selectedDate: ''
      };

      const result = applyAllFilters(mockResources, filters);
      expect(result).toHaveLength(0);
    });

    test('Docker MCP tag filter scenario from screenshot', () => {
      const filters: FilterState = {
        search: '',
        selectedTypes: [],
        selectedTags: ['Docker MCP'],
        selectedDate: ''
      };

      const result = applyAllFilters(mockResources, filters);
      expect(result).toHaveLength(3);
      expect(result.every(r => r.tags.includes('Docker MCP'))).toBe(true);
    });
  });
});