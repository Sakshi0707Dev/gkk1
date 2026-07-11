import Banner from '../models/banner.model.js';
import { AppError, asyncHandler } from '../utils/asyncHandler.js';

export const getActiveBanners = asyncHandler(async (_req, res) => {
  const banners = await Banner.find({ active: true }).sort({ order: 1 }).lean();
  res.json({ success: true, data: { banners } });
});

export const adminGetBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ order: 1 }).lean();
  res.json({ success: true, data: { banners } });
});

export const adminCreateBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, link, buttonText, active, order } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 1) {
    throw new AppError('Banner title is required.', 400);
  }

  let image = '';
  if (req.file) {
    image = req.file.path;
  }

  const banner = await Banner.create({
    title: title.trim(),
    subtitle: subtitle ? subtitle.trim() : '',
    image,
    link: link ? link.trim() : '',
    buttonText: buttonText ? buttonText.trim() : 'Shop Now',
    active: active === true || active === 'true',
    order: order != null ? Number(order) : 0,
  });

  res.status(201).json({ success: true, message: 'Banner created.', data: { banner } });
});

export const adminUpdateBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, image, link, buttonText, active, order, removeImage } = req.body;

  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new AppError('Banner not found.', 404);

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 1) throw new AppError('Title is required.', 400);
    banner.title = title.trim();
  }
  if (subtitle !== undefined) banner.subtitle = subtitle.trim();
  if (link !== undefined) banner.link = link.trim();
  if (buttonText !== undefined) banner.buttonText = buttonText.trim();
  if (active !== undefined) banner.active = active === true || active === 'true';
  if (order !== undefined) banner.order = Number(order);

  if (removeImage === 'true' || removeImage === true) {
    banner.image = '';
  }

  if (req.file) {
    banner.image = req.file.path;
  }

  await banner.save();
  res.json({ success: true, message: 'Banner updated.', data: { banner } });
});

export const adminDeleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new AppError('Banner not found.', 404);

  res.json({ success: true, message: 'Banner deleted.' });
});
