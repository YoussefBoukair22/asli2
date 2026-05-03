import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rrymmzenbhcsfiayeqcg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_nrJu7BaIOvHhAEczESLj3Q_1cCmVEpk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Upload image to Supabase Storage
export async function uploadImage(file, productId) {
  const fileName = `${productId}_${Date.now()}_${file.name}`
  const filePath = `products/${fileName}`

  // Create bucket if it doesn't exist
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { upsert: false })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('Image upload failed:', error)
    throw error
  }
}

// Delete image from storage
export async function deleteImage(imageUrl) {
  try {
    const fileName = imageUrl.split('/').pop()
    const filePath = `products/${fileName}`

    await supabase.storage
      .from('product-images')
      .remove([filePath])
  } catch (error) {
    console.error('Image delete failed:', error)
  }
}
