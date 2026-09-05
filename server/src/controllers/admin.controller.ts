import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { getSignedUrl } from '../services/storage.service';
import { statusUpdateSchema } from '../schemas/submission.schema';
import { generateExcel } from '../services/excel.service';

export const listSubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const { search, domain, status, fileType } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { submissionId: { contains: search as string } },
        { team: { teamName: { contains: search as string, mode: 'insensitive' } } },
        { leaderEmail: { contains: search as string } }
      ];
    }
    if (domain) where.domain = domain;
    if (status) where.status = status;
    if (fileType) where.fileType = fileType;

    const total = await prisma.submission.count({ where });
    const submissions = await prisma.submission.findMany({
      where,
      include: { team: true },
      orderBy: { submittedAt: 'desc' },
      skip,
      take: limit
    });

    res.json({
      submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: { team: true }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const url = await getSignedUrl(submission.storagePath, 300);
    res.json({ url, fileName: submission.fileName });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = statusUpdateSchema.parse(req.body);
    const submission = await prisma.submission.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await prisma.submission.count();
    
    const fileTypes = await prisma.submission.groupBy({
      by: ['fileType'],
      _count: true
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const submittedToday = await prisma.submission.count({
      where: { submittedAt: { gte: today } }
    });

    const domains = await prisma.submission.groupBy({
      by: ['domain'],
      _count: true
    });

    const statuses = await prisma.submission.groupBy({
      by: ['status'],
      _count: true
    });

    res.json({
      total,
      submittedToday,
      fileTypes: fileTypes.reduce((acc: any, curr: any) => ({ ...acc, [curr.fileType]: curr._count }), {}),
      domains: domains.reduce((acc: any, curr: any) => ({ ...acc, [curr.domain]: curr._count }), {}),
      statuses: statuses.reduce((acc: any, curr: any) => ({ ...acc, [curr.status]: curr._count }), {})
    });
  } catch (error) {
    next(error);
  }
};

export const exportExcel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: { team: true },
      orderBy: { submittedAt: 'desc' }
    });

    const buffer = generateExcel(submissions);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=codemerge-v2-submissions.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
