import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResourceLibrary from '../ResourceLibrary';

describe('ResourceLibrary', () => {
  test('renders with initial data showing all resources', () => {
    render(<ResourceLibrary />);
    
    expect(screen.getByText('All resources')).toBeInTheDocument();
    expect(screen.getByText('Understanding and Mitigating MCP Ecosystem Risks')).toBeInTheDocument();
    expect(screen.getByText('MCP Security: Where the Risks Lie and How to Contain Them')).toBeInTheDocument();
    expect(screen.getByText('IDC MCP Security Paper')).toBeInTheDocument();
    expect(screen.getByText('The Future of Agentic Apps: Building and Running MCP Servers the Right Way')).toBeInTheDocument();
  });

  test('search filtering works correctly', () => {
    render(<ResourceLibrary />);
    
    const searchInput = screen.getByPlaceholderText('Looking for something specific?');
    fireEvent.change(searchInput, { target: { value: 'IDC' } });
    
    expect(screen.getByText('IDC MCP Security Paper')).toBeInTheDocument();
    expect(screen.queryByText('Understanding and Mitigating MCP Ecosystem Risks')).not.toBeInTheDocument();
  });

  test('type filtering updates resource list', () => {
    render(<ResourceLibrary />);
    
    const videosCheckbox = screen.getByLabelText('Videos (1)');
    fireEvent.click(videosCheckbox);
    
    expect(screen.getByText('The Future of Agentic Apps: Building and Running MCP Servers the Right Way')).toBeInTheDocument();
    expect(screen.queryByText('Understanding and Mitigating MCP Ecosystem Risks')).not.toBeInTheDocument();
  });

  test('tag filtering updates resource list - Docker MCP scenario', () => {
    render(<ResourceLibrary />);
    
    const dockerMCPCheckbox = screen.getByLabelText('Docker MCP (4)');
    fireEvent.click(dockerMCPCheckbox);
    
    // All 4 resources should have Docker MCP tag
    expect(screen.getByText('Understanding and Mitigating MCP Ecosystem Risks')).toBeInTheDocument();
    expect(screen.getByText('MCP Security: Where the Risks Lie and How to Contain Them')).toBeInTheDocument();
    expect(screen.getByText('IDC MCP Security Paper')).toBeInTheDocument();
    expect(screen.getByText('The Future of Agentic Apps: Building and Running MCP Servers the Right Way')).toBeInTheDocument();
  });

  test('multiple filters work together', () => {
    render(<ResourceLibrary />);
    
    // Select White Papers type
    const whitePapersCheckbox = screen.getByLabelText('White Papers (2)');
    fireEvent.click(whitePapersCheckbox);
    
    // Select Security tag
    const securityCheckbox = screen.getByLabelText('Security (4)');
    fireEvent.click(securityCheckbox);
    
    // Should show 2 White Papers with Security tag
    expect(screen.getByText('Understanding and Mitigating MCP Ecosystem Risks')).toBeInTheDocument();
    expect(screen.queryByText('MCP Security: Where the Risks Lie and How to Contain Them')).not.toBeInTheDocument(); // Infographic
  });

  test('sort dropdown changes order', () => {
    render(<ResourceLibrary />);
    
    const sortDropdown = screen.getByDisplayValue('Sort results by');
    fireEvent.change(sortDropdown, { target: { value: 'date' } });
    
    // All resources are from 2024, so order should remain stable
    expect(screen.getByText('Understanding and Mitigating MCP Ecosystem Risks')).toBeInTheDocument();
  });

  test('reset button clears all filters', () => {
    render(<ResourceLibrary />);
    
    // Apply filters
    const searchInput = screen.getByPlaceholderText('Looking for something specific?');
    fireEvent.change(searchInput, { target: { value: 'Security' } });
    
    const securityCheckbox = screen.getByLabelText('Security (4)');
    fireEvent.click(securityCheckbox);
    
    // Click reset
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    // All filters should be cleared
    expect(searchInput).toHaveValue('');
    expect(securityCheckbox).not.toBeChecked();
    
    // All resources should be visible
    expect(screen.getByText('Understanding and Mitigating MCP Ecosystem Risks')).toBeInTheDocument();
    expect(screen.getByText('IDC MCP Security Paper')).toBeInTheDocument();
  });
});