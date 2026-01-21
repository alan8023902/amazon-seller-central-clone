import express from 'express';
import { dataService } from '../services/dataService';
import { z } from 'zod';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Define interfaces for better type safety
interface ApiResponseWithPagination<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// GET /api/communications/:storeId - 获取店铺的通讯数据
router.get('/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  
  try {
    // Decode URL-encoded store ID
    const decodedStoreId = decodeURIComponent(storeId);
    
    // Read communications data directly as JSON object (not array)
    const filePath = require('path').join(__dirname, '../../data/communications.json');
    const communicationsData = require('fs-extra').readJsonSync(filePath);
    
    let storeComms = communicationsData[decodedStoreId] || communicationsData[storeId];
    
    // If store communications not found, create default data
    if (!storeComms) {
      console.log(`Creating default communications data for store: ${decodedStoreId}`);
      
      storeComms = {
        seller_forums: [
          {
            id: `forum-${decodedStoreId}-1`,
            title: "Welcome to Seller Forums",
            author: "Amazon Team",
            views: 1234,
            replies: 56,
            likes: 78,
            category: "General",
            created_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            is_pinned: true,
            is_solved: false
          }
        ],
        seller_news: [
          {
            id: `news-${decodedStoreId}-1`,
            title: "Latest Updates for Sellers",
            author: "Amazon News",
            views: 2345,
            likes: 123,
            category: "Updates",
            created_at: new Date().toISOString(),
            is_featured: true
          }
        ]
      };
    }
    
    const response = {
      success: true,
      data: storeComms,
    };
    
    res.json(response);
  } catch (error) {
    console.error('Communications error:', error);
    throw createError('Failed to fetch communications data', 500);
  }
}));

// GET /api/communications/:storeId/forums - 获取论坛数据
router.get('/:storeId/forums', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { page = 1, limit = 10, category } = req.query;
  
  try {
    const communicationsData = await dataService.readData('communications') as any;
    const storeComms = communicationsData[storeId];
    
    if (!storeComms || !storeComms.seller_forums) {
      throw createError('Forums data not found', 404);
    }
    
    let forums = storeComms.seller_forums;
    
    // 按分类筛选
    if (category && category !== 'All') {
      forums = forums.filter((forum: any) => forum.category === category);
    }
    
    // 分页
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedForums = forums.slice(startIndex, endIndex);
    
    const response: ApiResponseWithPagination<any> = {
      success: true,
      data: paginatedForums,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: forums.length,
        pages: Math.ceil(forums.length / Number(limit))
      }
    };
    
    res.json(response);
  } catch (error) {
    throw createError('Failed to fetch forums data', 500);
  }
}));

// GET /api/communications/:storeId/news - 获取新闻数据
router.get('/:storeId/news', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { page = 1, limit = 10, category } = req.query;
  
  try {
    const communicationsData = await dataService.readData('communications') as any;
    const storeComms = communicationsData[storeId];
    
    if (!storeComms || !storeComms.seller_news) {
      throw createError('News data not found', 404);
    }
    
    let news = storeComms.seller_news;
    
    // 按分类筛选
    if (category && category !== 'All') {
      news = news.filter((item: any) => item.category === category);
    }
    
    // 分页
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedNews = news.slice(startIndex, endIndex);
    
    const response: ApiResponseWithPagination<any> = {
      success: true,
      data: paginatedNews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: news.length,
        pages: Math.ceil(news.length / Number(limit))
      }
    };
    
    res.json(response);
  } catch (error) {
    throw createError('Failed to fetch news data', 500);
  }
}));

// POST /api/communications/:storeId/forums/:forumId/like - 点赞论坛帖子
router.post('/:storeId/forums/:forumId/like', asyncHandler(async (req, res) => {
  const { storeId, forumId } = req.params;
  
  try {
    const communicationsData = await dataService.readData('communications') as any;
    const storeComms = communicationsData[storeId];
    
    if (!storeComms || !storeComms.seller_forums) {
      throw createError('Forums data not found', 404);
    }
    
    const forum = storeComms.seller_forums.find((f: any) => f.id === forumId);
    if (!forum) {
      throw createError('Forum post not found', 404);
    }
    
    // 增加点赞数
    forum.likes += 1;
    
    // 保存更新的数据
    await dataService.writeData('communications', communicationsData);
    
    const response = {
      success: true,
      data: { likes: forum.likes },
      message: 'Forum post liked successfully'
    };
    
    res.json(response);
  } catch (error) {
    throw createError('Failed to like forum post', 500);
  }
}));

// POST /api/communications/:storeId/news/:newsId/like - 点赞新闻
router.post('/:storeId/news/:newsId/like', asyncHandler(async (req, res) => {
  const { storeId, newsId } = req.params;
  
  try {
    const communicationsData = await dataService.readData('communications') as any;
    const storeComms = communicationsData[storeId];
    
    if (!storeComms || !storeComms.seller_news) {
      throw createError('News data not found', 404);
    }
    
    const news = storeComms.seller_news.find((n: any) => n.id === newsId);
    if (!news) {
      throw createError('News item not found', 404);
    }
    
    // 增加点赞数
    news.likes += 1;
    
    // 保存更新的数据
    await dataService.writeData('communications', communicationsData);
    
    const response = {
      success: true,
      data: { likes: news.likes },
      message: 'News item liked successfully'
    };
    
    res.json(response);
  } catch (error) {
    throw createError('Failed to like news item', 500);
  }
}));

export = router;