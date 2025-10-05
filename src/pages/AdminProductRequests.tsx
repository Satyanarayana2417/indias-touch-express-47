import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  User,
  MapPin,
  Link as LinkIcon,
  DollarSign,
  Calendar
} from 'lucide-react';
import { 
  ProductRequest, 
  getAllProductRequests, 
  updateProductRequestStatus, 
  updateProductRequestNotes 
} from '@/lib/productRequests';
import { useToast } from '@/hooks/use-toast';

const AdminProductRequests = () => {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [requestDetailsOpen, setRequestDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    quotedPrice: '',
    estimatedDelivery: '',
    notes: ''
  });
  const { toast } = useToast();

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
  }, []);

  // Filter requests when search term or status changes
  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await getAllProductRequests();
      setRequests(allRequests);
    } catch (error) {
      console.error('Error loading product requests:', error);
      toast({
        title: "Error",
        description: "Failed to load product requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleViewRequest = (request: ProductRequest) => {
    setSelectedRequest(request);
    setQuoteForm({
      quotedPrice: request.quotedPrice?.toString() || '',
      estimatedDelivery: request.estimatedDelivery || '',
      notes: request.notes || ''
    });
    setRequestDetailsOpen(true);
  };

  const handleStatusUpdate = async (
    requestId: string, 
    newStatus: ProductRequest['status'],
    includeQuote: boolean = false
  ) => {
    try {
      setUpdatingStatus(true);
      
      const quotedPrice = includeQuote && quoteForm.quotedPrice ? parseFloat(quoteForm.quotedPrice) : undefined;
      const estimatedDelivery = includeQuote ? quoteForm.estimatedDelivery : undefined;
      const notes = quoteForm.notes || undefined;

      await updateProductRequestStatus(requestId, newStatus, notes, quotedPrice, estimatedDelivery);
      
      // Update local state
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: newStatus,
              notes: notes || request.notes,
              quotedPrice: quotedPrice || request.quotedPrice,
              estimatedDelivery: estimatedDelivery || request.estimatedDelivery,
              updatedAt: new Date()
            }
          : request
      ));

      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({
          ...selectedRequest,
          status: newStatus,
          notes: notes || selectedRequest.notes,
          quotedPrice: quotedPrice || selectedRequest.quotedPrice,
          estimatedDelivery: estimatedDelivery || selectedRequest.estimatedDelivery,
          updatedAt: new Date()
        });
      }

      toast({
        title: "Success",
        description: `Request status updated to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleNotesUpdate = async (requestId: string, notes: string) => {
    try {
      await updateProductRequestNotes(requestId, notes);
      
      // Update local state
      setRequests(requests.map(request => 
        request.id === requestId ? { ...request, notes, updatedAt: new Date() } : request
      ));

      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, notes, updatedAt: new Date() });
      }

      toast({
        title: "Success",
        description: "Request notes updated.",
      });
    } catch (error) {
      console.error('Error updating request notes:', error);
      toast({
        title: "Error",
        description: "Failed to update request notes.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: ProductRequest['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'quote_sent': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: ProductRequest['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'quote_sent': return Send;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatPrice = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const requestStats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    quoteSent: requests.filter(r => r.status === 'quote_sent').length,
    approved: requests.filter(r => r.status === 'approved').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading product requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Requests</h1>
        <p className="text-gray-500">Manage customer product sourcing requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Total Requests</div>
            <div className="text-2xl font-bold">{requestStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{requestStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Quote Sent</div>
            <div className="text-2xl font-bold text-blue-600">{requestStats.quoteSent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Approved</div>
            <div className="text-2xl font-bold text-purple-600">{requestStats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-green-600">{requestStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests by product, email, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Requests
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('quote_sent')}>
                    Quote Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                    Rejected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Product Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Product requests will appear here when customers submit them'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quote</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{request.productName}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {request.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.recipientName}</div>
                            <div className="text-sm text-gray-500">{request.userEmail}</div>
                            <div className="text-sm text-gray-500">{request.country}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.quotedPrice ? (
                            <div>
                              <div className="font-medium">{formatPrice(request.quotedPrice)}</div>
                              {request.estimatedDelivery && (
                                <div className="text-sm text-gray-500">
                                  {request.estimatedDelivery}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No quote</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(request.requestTimestamp)}</div>
                          {request.updatedAt && (
                            <div className="text-xs text-gray-500">
                              Updated: {formatDate(request.updatedAt)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewRequest(request)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(request.id!, 'quote_sent')}
                                disabled={request.status !== 'pending' || updatingStatus}
                              >
                                Send Quote
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(request.id!, 'approved')}
                                disabled={request.status === 'completed' || request.status === 'rejected' || updatingStatus}
                              >
                                Mark as Approved
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(request.id!, 'completed')}
                                disabled={request.status !== 'approved' || updatingStatus}
                              >
                                Mark as Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      <Dialog open={requestDetailsOpen} onOpenChange={setRequestDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Product Request Details
            </DialogTitle>
            <DialogDescription>
              Review and manage product request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Status and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(selectedRequest.status)} className="flex items-center gap-1">
                    {React.createElement(getStatusIcon(selectedRequest.status), { className: "h-3 w-3" })}
                    {selectedRequest.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Requested: {formatDate(selectedRequest.requestTimestamp)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value) => handleStatusUpdate(selectedRequest.id!, value as ProductRequest['status'])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="quote_sent">Quote Sent</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Product Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Product Name</Label>
                      <p className="text-sm font-medium">{selectedRequest.productName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedRequest.description}
                      </p>
                    </div>
                    {selectedRequest.productLink && (
                      <div>
                        <Label className="text-sm font-medium">Product Link</Label>
                        <a 
                          href={selectedRequest.productLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          {selectedRequest.productLink}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Customer Email</Label>
                      <p className="text-sm">{selectedRequest.userEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Recipient Name</Label>
                      <p className="text-sm">{selectedRequest.recipientName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Shipping Address</Label>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedRequest.shippingAddress}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Country</Label>
                      <p className="text-sm">{selectedRequest.country}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quote and Response */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Quote & Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quotedPrice">Quoted Price (₹)</Label>
                      <Input
                        id="quotedPrice"
                        type="number"
                        placeholder="0.00"
                        value={quoteForm.quotedPrice}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, quotedPrice: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                      <Input
                        id="estimatedDelivery"
                        placeholder="5-7 business days"
                        value={quoteForm.estimatedDelivery}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add notes about this request, communication with customer, etc."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id!, 'quote_sent', true)}
                      disabled={!quoteForm.quotedPrice || updatingStatus}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send Quote
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleNotesUpdate(selectedRequest.id!, quoteForm.notes)}
                      disabled={updatingStatus}
                    >
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductRequests;
