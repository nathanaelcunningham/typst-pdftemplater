import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Tag, Clock } from 'lucide-react';
import { listTemplates, deleteTemplate } from "../api";
import type { Template } from "../api/types";
import { useTemplateStore } from "../store/templateStore";

export function TemplateList() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { createBlankTemplate } = useTemplateStore();

    // Load templates on mount
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await listTemplates();
            setTemplates(data);
        } catch (err) {
            console.error("Failed to load templates:", err);
            setError("Failed to load templates. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = () => {
        createBlankTemplate();
        navigate("/");
    };

    const handleOpenTemplate = (templateId: string) => {
        navigate(`/editor/${templateId}`);
    };

    const handleDeleteTemplate = async (
        templateId: string,
        templateName: string,
    ) => {
        const confirmed = confirm(
            `Delete template "${templateName}"? This cannot be undone.`,
        );
        if (!confirmed) return;

        try {
            await deleteTemplate(templateId);
            setTemplates(templates.filter((t) => t.id !== templateId));
        } catch (err) {
            console.error("Failed to delete template:", err);
            alert("Failed to delete template. Please try again.");
        }
    };

    const filteredTemplates = templates.filter(
        (template) =>
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-charcoal border-b-2 border-amber">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-serif font-semibold text-cream tracking-tight">
                            Templates
                        </h1>
                        <button
                            onClick={handleCreateNew}
                            className="px-6 py-3 text-sm font-medium text-charcoal bg-amber rounded-md hover:bg-amber-dark active:scale-95 transition-all shadow-md hover:shadow-lg"
                        >
                            + New Template
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search templates..."
                        className="w-full max-w-xl px-4 py-3 bg-paper border-2 border-cream-dark text-ink placeholder-slate-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                    />
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-16">
                        <div className="inline-block w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 text-slate-lighter">Loading templates...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={loadTemplates}
                            className="mt-4 px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredTemplates.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📄</div>
                        <h2 className="text-2xl font-serif font-semibold text-ink mb-2">
                            {searchQuery ? "No templates found" : "No templates yet"}
                        </h2>
                        <p className="text-slate-lighter mb-6">
                            {searchQuery
                                ? "Try adjusting your search"
                                : "Create your first PDF template to get started"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleCreateNew}
                                className="px-6 py-3 text-sm font-medium text-charcoal bg-amber rounded-md hover:bg-amber-dark active:scale-95 transition-all shadow-md"
                            >
                                + New Template
                            </button>
                        )}
                    </div>
                )}

                {/* Templates Grid */}
                {!isLoading && !error && filteredTemplates.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-paper border-2 border-cream-dark rounded-lg p-6 hover:border-amber hover:shadow-lg transition-all cursor-pointer group"
                                onClick={() => handleOpenTemplate(template.id)}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-serif font-semibold text-ink group-hover:text-amber-dark transition-colors">
                                        {template.name}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTemplate(template.id, template.name);
                                        }}
                                        className="text-slate-lighter hover:text-red-600 transition-colors p-1"
                                        title="Delete template"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Description */}
                                {template.description && (
                                    <p className="text-sm text-slate-lighter mb-4 line-clamp-2">
                                        {template.description}
                                    </p>
                                )}

                                {/* Metadata */}
                                <div className="flex items-center gap-4 text-xs text-slate-lighter">
                                    <div className="flex items-center gap-1">
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(template.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
