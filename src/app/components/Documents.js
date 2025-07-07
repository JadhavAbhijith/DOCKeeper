'use client'
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const storedDocuments = JSON.parse(localStorage.getItem('documents')) || [];
        setDocuments(storedDocuments);
    }, []);

    const handleViewDocument = (id) => {
        const document = documents.find(doc => doc.id === id);
        setSelectedDocument(document);
        setShowModal(true);
    };

    const handleDeleteDocument = (id) => {
        // Remove document with given ID
        const updatedDocuments = documents
            .filter((document) => document.id !== id)
            .map((doc, index) => ({
                ...doc,
                id: index + 1  // Reassign ID starting from 1
            }));

        setDocuments(updatedDocuments);
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    };

    const filteredDocuments = documents.filter(document =>
        document.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFileType = (dataUrl = '') => {
        if (dataUrl.includes('application/pdf')) return 'pdf';
        if (dataUrl.includes('image/')) return 'image';
        if (dataUrl.includes('text/plain')) return 'txt';
        if (dataUrl.includes('application/msword') || dataUrl.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'doc';
        return 'other';
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-1 border-end"></div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="col mt-3">
                        <h2 className="display-6">My Documents</h2>

                        <table className="table mt-5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Created Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.map((document) => (
                                    <tr key={`${document.id}-${document.name}`}>
                                        <td>{document.id}</td>
                                        <td>{document.name}</td>
                                        <td>{document.date}</td>
                                        <td>
                                            <button className="btn btn-primary"
                                                onClick={() => handleViewDocument(document.id)}>
                                                View
                                            </button>
                                            <button className="btn btn-danger ms-2"
                                                onClick={() => handleDeleteDocument(document.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && selectedDocument && (
                <div className="modal" tabIndex="-1" role="dialog" style={{
                    display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="modal-title">{selectedDocument.name}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    style={{ color: 'red', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', background: 'transparent' }}
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body" style={{ height: '80vh' }}>
                                {(() => {
                                    const fileType = getFileType(selectedDocument.image);
                                    if (fileType === 'pdf' || fileType === 'txt') {
                                        return (
                                            <iframe
                                                src={selectedDocument.image}
                                                title="Document Viewer"
                                                width="100%"
                                                height="100%"
                                                style={{ border: 'none' }}
                                            ></iframe>
                                        );
                                    } else if (fileType === 'image') {
                                        return (
                                            <img
                                                src={selectedDocument.image}
                                                alt="Document"
                                                className="img-fluid"
                                            />
                                        );
                                    } else if (fileType === 'doc') {
                                        return (
                                            <div>
                                                <p>This document cannot be viewed directly. Click below to download and open it:</p>
                                                <a
                                                    href={selectedDocument.image}
                                                    download={selectedDocument.name}
                                                    className="btn btn-secondary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Download Document
                                                </a>
                                            </div>
                                        );
                                    } else {
                                        return <p>Unsupported document type.</p>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Documents;
